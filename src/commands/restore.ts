import { Command } from 'commander';
import { logger } from '../utils/logger.js';
import { handleError } from '../utils/handle-error.js';
import { BaseOptions } from '../types/environment.js';

interface RestoreOptions extends BaseOptions {
    fromCloud: boolean;
    force: boolean;
}

export const restoreCommand = new Command('restore')
    .description('Восстановить инфраструктуру и данные из резервной копии')
    .argument(
        '[backup_path_or_id]',
        'Путь к локальному файлу или ID бэкапа из облака',
    )
    .option(
        '-e, --env <environment>',
        'Целевое окружение для восстановления: dev, stage, prod',
        'dev',
    )
    .option(
        '--from-cloud',
        'Искать и скачивать указанный бэкап из облачного хранилища',
        false,
    )
    .option(
        '--force',
        'Не запрашивать подтверждение при перезаписи существующих данных',
        false,
    )
    .action(async (backup: string | undefined, options: RestoreOptions) => {
        try {
            logger.log(backup, options);
        } catch (err) {
            handleError(err);
        }
    });
