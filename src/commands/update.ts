import { Command } from 'commander';
import { logger } from '../utils/logger.js';
import { handleError } from '../utils/handle-error.js';
import { BaseOptions } from '../types/environment.js';

interface UpdateOptions extends BaseOptions {
    pull: boolean;
    build: boolean;
    hard: boolean;
}

export const updateCommand = new Command('update')
    .description(
        'Обновить образы, микросервисы или конфигурацию до актуальной версии',
    )
    .argument('[service]', 'Имя конкретного сервиса для обновления')
    .option('-e, --env <environment>', 'Окружение: dev, stage, prod', 'dev')
    .option(
        '--no-pull',
        'Не подтягивать новые сборки образов из Docker Registry',
    )
    .option(
        '--build',
        'Принудительно пересобрать локальные Dockerfile перед деплоем',
        false,
    )
    .option(
        '--hard',
        'Полный перезапуск стека с удалением старых контейнеров (возможен downtime)',
        false,
    )
    .action(async (service: string | undefined, options: UpdateOptions) => {
        try {
            logger.log(service, options);
        } catch (err) {
            handleError(err);
        }
    });
