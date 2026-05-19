import { Command } from 'commander';
import { activateCommand } from './activate.js';
import { queryCommand } from './query.js';

export const aiCommand = new Command()
    .name('ai')
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
    .addCommand(activateCommand)
    .addCommand(queryCommand);
