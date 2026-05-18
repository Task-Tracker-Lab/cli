import { ZodError } from 'zod/v4';
import { logger } from './logger.js';
import { highlighter } from './highlighter.js';

export function handleError(err: unknown) {
    logger.break();
    logger.error(
        `Что-то пошло не так. Please check the error below for more details.`,
    );
    logger.error(`If the problem persists, please open an issue on GitHub.`);
    logger.error('');

    if (typeof err === 'string') {
        logger.error(err);
    }

    if (err instanceof ZodError) {
        logger.error('Validation failed:');
        for (const [key, value] of Object.entries(err.flatten().fieldErrors)) {
            logger.error(`- ${highlighter.info(key)}: ${value}`);
        }
    }

    if (err instanceof Error) {
        logger.error(err.message);
    }
}
