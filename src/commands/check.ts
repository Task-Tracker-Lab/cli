import { Command } from 'commander';
import { logger } from '../utils/logger.js';
import { handleError } from '../utils/handle-error.js';
import { execa } from 'execa';
import * as path from 'path';
import * as fs from 'fs';
import { ENV } from '../configs/index.js';

interface CheckOptions {
    all?: boolean;
    fix?: boolean;
    strict?: boolean;
    path?: string;
}

const ensureDocker = async () => {
    await execa('docker', ['-v']);
    logger.log('✔ Docker установлен на сервере');
};

const ensureSwarm = async (options: CheckOptions) => {
    const { stdout } = await execa('docker', [
        'info',
        '--format',
        '{{.Swarm.LocalNodeState}}',
    ]);

    if (stdout.trim() !== 'active') {
        if (options.fix) {
            logger.log('⚠ Docker Swarm не активирован. Включаю...');
            await execa('docker', ['swarm', 'init']);
            logger.log('✔ Docker Swarm успешно запущен');
        } else {
            const msg =
                'Docker Swarm не активен (требуется docker swarm init).';
            if (options.strict) throw new Error(msg);
            logger.log(`⚠ Предупреждение: ${msg}`);
        }
    } else {
        logger.log('✔ Docker Swarm работает в штатном режиме');
    }
};

const ensureInfrastructureSources = async (
    pwd: string,
    options: Omit<CheckOptions, 'path'>,
) => {
    const isTargetExists = fs.existsSync(pwd);

    if (!isTargetExists) {
        if (options.fix) {
            logger.log(
                `⚠ Папка [${path.basename(pwd)}] не найдена. Тянем инфраструктуру из Git...`,
            );
            await execa('git', ['clone', ENV.SOURCE_REPOSITORY, pwd]);
            logger.log('✔ Инфраструктура успешно склонирована!');
        } else {
            const msg = `Папка инфраструктуры [${path.basename(pwd)}] отсутствует.`;
            if (options.strict) throw new Error(msg);
            logger.log(
                `❌ Ошибка: ${msg} Запустите с флагом --fix для автоматической загрузки.`,
            );
        }
    } else {
        logger.log('✔ Исходные файлы инфраструктуры найдены локально');

        if (options.strict) {
            logger.log(' Проверяем чистоту локального репозитория...');
            const { stdout } = await execa('git', ['-C', pwd, 'status', '-s']);
            if (stdout.trim()) {
                throw new Error(
                    'В локальной папке деплоя есть незакоммиченные изменения!',
                );
            }
            logger.log('✔ Локальная копия полностью соответствует Git');
        }
    }
};

const checkSingleService = async (service: string) => {
    logger.log(` Проверяем статус микросервиса: ${service}...`);
    const { stdout } = await execa('docker', [
        'service',
        'ls',
        '--filter',
        `name=${service}`,
        '--format',
        '{{.Replicas}}',
    ]);

    if (!stdout.trim()) {
        logger.log(`❌ Сервис "${service}" сейчас не запущен в Swarm.`);
    } else {
        logger.log(`✔ Сервис "${service}" активен. Реплики: ${stdout.trim()}`);
    }
};

export const checkCommand = new Command('check')
    .description(
        'Проверить готовность инфраструктуры, конфигураций и окружения',
    )
    .argument('[service]', 'Проверить готовность конкретного микросервиса')
    .option(
        '-p, --path <absolute_or_relative_path>',
        'Целевая папка проекта (по умолчанию: текущая директория)',
    )
    .option(
        '--fix',
        'Попытаться автоматически исправить мелкие ошибки (например, создать пустые папки или скопировать .env.example)',
        false,
    )
    .option(
        '--strict',
        'Строгий режим: расценивать любые предупреждения (warnings) как критические ошибки',
        false,
    )
    .action(async (service: string | undefined, options: CheckOptions) => {
        try {
            logger.log('\n Запуск экспресс-диагностики сервера...');
            await ensureDocker();
            await ensureSwarm(options);

            const pwd = options.path
                ? path.resolve(options.path)
                : path.resolve('./infra');

            await ensureInfrastructureSources(pwd, options);

            if (service) await checkSingleService(service);

            logger.log(' Диагностика успешно завершена.\n');
        } catch (err) {
            handleError(err);
        }
    });
