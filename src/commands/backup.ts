import { Command } from 'commander';
import { logger } from '../utils/logger.js';
import { handleError } from '../utils/handle-error.js';
import { BaseOptions } from '../types/environment.js';

interface BackupOptions extends BaseOptions {
    output?: string;
    cloud: boolean;
    compress: boolean;
}

export const backupCommand = new Command('backup')
    .description('Создать резервную копию базы данных, конфигураций и volumes')
    .option(
        '-e, --env <environment>',
        'Окружение для бэкапа: dev, stage, prod',
        'dev',
    )
    .option('-o, --output <path>', 'Путь для сохранения архива локально')
    .option(
        '--cloud',
        'Загрузить созданный бэкап в удаленное облачное хранилище (S3/Yandex)',
        false,
    )
    .option(
        '--no-compress',
        'Отключить сжатие (создать быстрый сырой дамп данных)',
    )
    .action(async (options: BackupOptions) => {
        try {
            logger.log(options);
        } catch (err) {
            handleError(err);
        }
    });
