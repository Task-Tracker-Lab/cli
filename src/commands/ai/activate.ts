import { Command } from 'commander';
import { handleError } from '../../utils/handle-error.js';
import { logger } from '../../utils/logger.js';

interface ActivateOptions {
    token?: string;
    provider: 'openai' | 'anthropic' | 'ollama';
}

export const activateCommand = new Command()
    .name('activate')
    .description('Активировать ИИ-помощника, привязать провайдера и API-токен')
    .requiredOption(
        '-p, --provider <name>',
        'ИИ-провайдер: openai, anthropic, ollama',
        'openai',
    )
    .option(
        '-t, --token <key>',
        'API-токен для авторизации (не требуется для локального ollama)',
    )
    .action(async (options: ActivateOptions) => {
        try {
            logger.log('Запуск активации ИИ...', options);
        } catch (err) {
            handleError(err);
        }
    });
