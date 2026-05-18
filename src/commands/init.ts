import { Command } from 'commander';
import { handleError, logger } from '../utils/index.js';

export const initCommand = new Command('init')
    .description('Инициализация инфраструктуры проекта')
    .option(
        '-a, --advanced',
        'включить расширенную настройку портов и путей',
        false,
    )
    .option('-f, --force', 'перезаписать существующий .env', false)
    .option('-y, --yes', 'автоматическое подтверждение всех действий')
    .option('--skip-swarm', 'не инициализировать Docker Swarm')
    .option('-e, --env <path>', 'путь к файлу окружения', '.env')
    .action(async (options) => {
        try {
            logger.log(options);
        } catch (err) {
            handleError(err);
        }
    });
