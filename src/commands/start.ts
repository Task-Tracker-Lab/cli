import { Command } from 'commander';
import { logger } from '../utils/logger.js';
import { handleError } from '../utils/handle-error.js';
import { BaseOptions } from '../types/environment.js';

interface StartOptions extends BaseOptions {
    all?: boolean;
    withDeps?: boolean;
    build?: boolean;
    concurrency?: string;
}

export const startCommand = new Command('start')
    .description('Запустить сервис или всю инфраструктуру')
    .argument('[service]', 'Имя конкретного микросервиса для запуска')
    .option('-e, --env <environment>', 'Окружение: dev, stage, prod', 'dev')
    .option(
        '-a, --all',
        'Запустить ВСЮ инфраструктуру (все сервисы окружения)',
        false,
    )
    .option(
        '-d, --with-deps',
        'Запустить также все сервисы, от которых зависит данный',
        false,
    )
    .option('-b, --build', 'Пересобрать образы/артефакты перед запуском', false)
    .option(
        '-c, --concurrency <number>',
        'Количество параллельно запускаемых сервисов (для --all)',
        '5',
    )
    .action(async (service: string | undefined, options: StartOptions) => {
        try {
            logger.log(service, options);
        } catch (err) {
            handleError(err);
        }
    });
