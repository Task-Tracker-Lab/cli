import { Command } from 'commander';
import { logger } from '../utils/logger.js';
import { handleError } from '../utils/handle-error.js';
import { BaseOptions } from '../types/environment.js';

interface CleanOptions extends BaseOptions {
    images: boolean;
    volumes: boolean;
    logs: boolean;
    force: boolean;
}

export const cleanCommand = new Command('clean')
    .description(
        'Безопасно очистить неиспользуемые Docker-ресурсы и устаревшие логи',
    )
    .option('--no-images', 'Не удалять зависшие (dangling) Docker-образы')
    .option(
        '--volumes',
        'Включить в очистку неиспользуемые volumes баз данных (ОПАСНО)',
        false,
    )
    .option('--logs', 'Очистить старые файлы системных логов на диске', true)
    .option(
        '-f, --force',
        'Пропустить интерактивное подтверждение удаления',
        false,
    )
    .action(async (options: CleanOptions) => {
        try {
            logger.log(options);
        } catch (err) {
            handleError(err);
        }
    });
