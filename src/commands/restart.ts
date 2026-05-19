import { Command } from 'commander';
import { logger } from '../utils/logger.js';
import { handleError } from '../utils/handle-error.js';
import { BaseOptions } from '../types/environment.js';

interface RestartOptions extends BaseOptions {
    all?: boolean;
    strategy: 'recreate' | 'rolling';
    failedOnly?: boolean;
    hard?: boolean;
}

export const restartCommand = new Command('restart')
    .description('Перезапустить сервис или всю инфраструктуру')
    .argument('[service]', 'Имя конкретного микросервиса для перезапуска')
    .option('-e, --env <environment>', 'Окружение: dev, stage, prod', 'dev')
    .option('-a, --all', 'Перезапустить ВСЮ инфраструктуру окружения', false)
    .option(
        '-s, --strategy <type>',
        'Стратегия перезапуска: recreate, rolling',
        'recreate',
    )
    .option(
        '--failed-only',
        'Перезапустить ТОЛЬКО упавшие/деградировавшие сервисы',
        false,
    )
    .option(
        '--hard',
        'Жесткий рестарт (с очисткой кэша, временных файлов или Docker-контейнеров)',
        false,
    )
    .action(async (service: string | undefined, options: RestartOptions) => {
        try {
            logger.log(service, options);
        } catch (err) {
            handleError(err);
        }
    });
