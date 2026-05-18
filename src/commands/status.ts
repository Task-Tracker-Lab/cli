import { Command } from 'commander';
import { logger } from '../utils/logger.js';
import { handleError } from '../utils/handle-error.js';

interface StatusOptions {
    env: 'dev' | 'stage' | 'prod';
    group?: string;
    failedOnly?: boolean;
    json?: boolean;
    watch?: boolean;
}

export const statusCommand = new Command('status')
    .description('Показать статус инфраструктуры и сервисов')
    .argument(
        '[service]',
        'Имя конкретного микросервиса (для глубокого анализа)',
    )
    .option('-e, --env <environment>', 'Окружение: dev, stage, prod', 'dev')
    .option(
        '-g, --group <name>',
        'Фильтр по группе/пространству сервисов (например: billing)',
    )
    .option(
        '--failed-only',
        'Показать ТОЛЬКО упавшие или деградировавшие сервисы',
        false,
    )
    .option('-j, --json', 'Выгрузить полный слепок статуса инфры в JSON', false)
    .option(
        '-w, --watch',
        'Включить интерактивный мониторинг всей инфры (dashboard)',
        false,
    )
    .action(async (service: string | undefined, options: StatusOptions) => {
        try {
            logger.log(service, options);
        } catch (err) {
            handleError(err);
        }
    });
