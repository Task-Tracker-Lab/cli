#! /usr/bin/env node
import 'dotenv/config';
import { program } from 'commander';
import chalk from 'chalk';
import { HELP_CONFIG } from '../src/configs/help.js';
import { ENV } from '../src/configs/env/index.js';
import {
    checkCommand,
    initCommand,
    restartCommand,
    startCommand,
    statusCommand,
    stopCommand,
} from '../src/commands/index.js';

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
    .addCommand(initCommand)
    .addCommand(stopCommand)
    .addCommand(checkCommand)
    .addCommand(startCommand)
    .addCommand(restartCommand)
    .addCommand(statusCommand);

program.parse(process.argv);

if (!process.argv.slice(2).length) {
    program.outputHelp();
}
