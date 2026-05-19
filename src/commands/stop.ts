import { Command } from 'commander';
import { logger } from '../utils/logger.js';
import { handleError } from '../utils/handle-error.js';
import { BaseOptions } from '../types/environment.js';

interface StopOptions extends BaseOptions {
    force?: boolean;
    timeout?: string;
    all?: boolean;
}

export const stopCommand = new Command('stop')
    .description('Остановить запущенный сервис или всю инфраструктуру')
    .argument('[service]', 'Имя конкретного сервиса для остановки')
    .option('-a, --all', 'Остановить ВСЕ сервисы окружения', false)
    .option('-f, --force', 'Принудительная остановка (SIGKILL)', false)
    .action(async (service: string | undefined, options: StopOptions) => {
        try {
            logger.log(service, options);
        } catch (err) {
            handleError(err);
        }
    });
