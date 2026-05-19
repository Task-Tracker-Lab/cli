import { Command } from 'commander';
import { logger } from '../utils/logger.js';
import { handleError } from '../utils/handle-error.js';
import { BaseOptions } from '../types/environment.js';

interface TroubleshootOptions extends BaseOptions {
    autoFix: boolean;
    service?: string;
}

export const troubleshootCommand = new Command('troubleshoot')
    .description(
        'Запустить ИИ-анализ логов и системных ошибок для поиска решений',
    )
    .alias('fix')
    .option(
        '-e, --env <environment>',
        'Рабочее окружение: dev, stage, prod',
        'dev',
    )
    .option(
        '-s, --service <name>',
        'Целевой сервис для сканирования (если не указан — проверяется весь стек)',
    )
    .option(
        '--auto-fix',
        'Автоматически применять предложенные ИИ решения без подтверждения',
        false,
    )
    .action(async (options: TroubleshootOptions) => {
        try {
            logger.log(options);
        } catch (err) {
            handleError(err);
        }
    });
