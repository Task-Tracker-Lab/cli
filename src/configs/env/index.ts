import z from 'zod/v4';
import { ENV_SCHEMA } from './schema.js';
import chalk from 'chalk';

const raw = z.safeParse(ENV_SCHEMA, process.env);

if (!raw.success) {
    console.error(chalk.red.bold('\n❌ Ошибка конфигурации окружения:'));

    raw.error.issues.forEach((issue) => {
        const path = issue.path.join('.');
        console.error(
            `${chalk.yellow(path || 'root')}: ${chalk.white(issue.message)}`,
        );
    });

    console.log(chalk.dim('\nПроверьте файл .env или переменные окружения.\n'));

    process.exit(1);
}
export const ENV = raw.data;
