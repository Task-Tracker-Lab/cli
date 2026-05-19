import { Command } from 'commander';
import { logger } from '../utils/logger.js';
import { handleError } from '../utils/handle-error.js';
import { BaseOptions } from '../types/environment.js';

interface AiOptions extends BaseOptions {
    add?: string;
    modify?: string;
    contextLines: number;
}

export const aiCommand = new Command('ai')
    .description(
        'Запустить интерактивного ИИ-помощника для управления инфраструктурой',
    )
    .argument(
        '[prompt]',
        'Прямой вопрос или команда для ИИ (например, "почему упала база?")',
    )
    .option(
        '-t, --token <key>',
        'Передать API-токен для текущего запроса (или перезаписи сохраненного)',
    )
    .option(
        '-e, --env <environment>',
        'Окружение для контекста: dev, stage, prod',
        'dev',
    )
    .option(
        '--add <service_description>',
        'Сгенерировать и добавить новый сервис в стек Swarm',
    )
    .option(
        '--modify <change_description>',
        'Внести изменения в существующую конфигурацию через ИИ',
    )
    .option(
        '--context-lines <number>',
        'Количество строк логов, передаваемых ИИ для анализа',
        '100',
    )
    .action(async (prompt: string | undefined, options: AiOptions) => {
        try {
            logger.log(prompt, options);
        } catch (err) {
            handleError(err);
        }
    });
