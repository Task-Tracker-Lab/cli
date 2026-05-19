#! /usr/bin/env node
import 'dotenv/config';
import { program } from 'commander';
import chalk from 'chalk';
import { HELP_CONFIG } from '../src/configs/help.js';
import { ENV } from '../src/configs/env/index.js';
import {
    initCommand,
    stopCommand,
    aiCommand,
    cleanCommand,
    checkCommand,
    startCommand,
    backupCommand,
    updateCommand,
    configCommand,
    reportCommand,
    statusCommand,
    restoreCommand,
    restartCommand,
    troubleshootCommand,
} from '../src/commands/index.js';

process.on('SIGINT', () => process.exit(0));
process.on('SIGTERM', () => process.exit(0));

function bootstrap() {
    program.name('tt').version(ENV.VERSION).usage('[command] [options]');

    program
        .configureHelp(HELP_CONFIG.format)
        .addHelpText('before', HELP_CONFIG.banners.before)
        .addHelpText('after', HELP_CONFIG.banners.after);

    program
        .option('-v, --verbose', 'подробный вывод')
        .showHelpAfterError(
            chalk.red('\n(Ошибка в команде! Посмотрите справку выше)'),
        )
        .showSuggestionAfterError();

    program
        .addCommand(aiCommand)
        .addCommand(initCommand)
        .addCommand(stopCommand)
        .addCommand(checkCommand)
        .addCommand(startCommand)
        .addCommand(cleanCommand)
        .addCommand(statusCommand)
        .addCommand(configCommand)
        .addCommand(reportCommand)
        .addCommand(updateCommand)
        .addCommand(backupCommand)
        .addCommand(restartCommand)
        .addCommand(restoreCommand)
        .addCommand(troubleshootCommand);

    program.parse(process.argv);
}

bootstrap();
