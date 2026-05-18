import { Command } from 'commander';
import { logger } from '../utils/logger.js';
import { handleError } from '../utils/handle-error.js';

interface CheckOptions {
    env: 'dev' | 'stage' | 'prod';
    all?: boolean;
    fix?: boolean;
    strict?: boolean;
}

export const checkCommand = new Command('check')
    .description(
        'Проверить готовность инфраструктуры, конфигураций и окружения',
    )
    .argument('[service]', 'Проверить готовность конкретного микросервиса')
    .option(
        '-e, --env <environment>',
        'Окружение для проверки: dev, stage, prod',
        'dev',
    )
    .option(
        '-a, --all',
        'Запустить полную диагностику всей инфраструктуры',
        false,
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
            logger.log(service, options);
        } catch (err) {
            handleError(err);
        }
    });
