import { Command } from 'commander';
import { logger } from '../utils/logger.js';
import { handleError } from '../utils/handle-error.js';
import { BaseOptions } from '../types/environment.js';

interface ConfigOptions extends BaseOptions {
    json: boolean;
}

export const configCommand = new Command('config')
    .description(
        'Просмотр и безопасное изменение переменных окружения и конфигов',
    )
    .argument(
        '[action]',
        'Действие: list (показать все), get (получить), set (установить)',
    )
    .argument(
        '[key=value]',
        'Ключ и значение для изменения (например, PORT=8080)',
    )
    .option(
        '-e, --env <environment>',
        'Окружение для правки: dev, stage, prod',
        'dev',
    )
    .option('--json', 'Выводить результат в формате JSON вместо таблицы', false)
    .action(
        async (
            action: string | undefined,
            keyValue: string | undefined,
            options: ConfigOptions,
        ) => {
            try {
                logger.log(action, keyValue, options);
            } catch (err) {
                handleError(err);
            }
        },
    );
