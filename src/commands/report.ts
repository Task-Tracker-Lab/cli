import { Command } from 'commander';
import { logger } from '../utils/logger.js';
import { handleError } from '../utils/handle-error.js';
import { BaseOptions } from '../types/environment.js';

interface ReportOptions extends BaseOptions {
    raw: boolean;
    upload: boolean;
}

export const reportCommand = new Command('report')
    .description(
        'Сгенерировать анонимизированный отчет о состоянии инфры для передачи разработчику',
    )
    .alias('share-logs')
    .option('-e, --env <environment>', 'Окружение: dev, stage, prod', 'dev')
    .option(
        '--raw',
        'Не вырезать чувствительные данные (пароли, токены) из отчета',
        false,
    )
    .option(
        '--no-upload',
        'Только сохранить отчет локально, не загружать на pastebin-сервер',
    )
    .action(async (options: ReportOptions) => {
        try {
            logger.log(options);
        } catch (err) {
            handleError(err);
        }
    });
