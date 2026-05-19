import { Command } from 'commander';
import { logger } from '../../utils/logger.js';
import { handleError } from '../../utils/handle-error.js';

interface QueryOptions {
    service?: string;
}

export const queryCommand = new Command('query')
    .description(
        'Задать ИИ вопрос о текущем состоянии инфраструктуры или логах',
    )
    .argument(
        '<prompt>',
        'Ваш вопрос (например, "почему база данных перезапускается?")',
    )
    .option(
        '-s, --service <name>',
        'Передать ИИ контекст и логи конкретного сервиса',
    )
    .action(async (prompt: string, options: QueryOptions) => {
        try {
            logger.log(`ИИ-запрос: "${prompt}"`, options);
        } catch (err) {
            handleError(err);
        }
    });
