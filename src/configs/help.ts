import chalk from 'chalk';
import { ENV } from './env/index.js';

export const HELP_CONFIG = {
    format: {
        sortSubcommands: true,
        subcommandTerm: (cmd: any) => chalk.bold.yellow(cmd.name()),
        commandDescription: (cmd: any) => chalk.dim(cmd.description()),
    },
    banners: {
        before: `
${chalk.bgBlue.white.bold(' INFRASTRUCTURE CLI ')} ${chalk.bold('Система управления окружениями ttopen')}
${chalk.dim('Профессиональная автоматизация развертывания, оркестрации и диагностики.')}
`,
        after: `
Usage:

 ${chalk.blue.bold('● Диагностика и статус:')}
   $ tt check --all                   ${chalk.gray('# Полная проверка готовности хоста и конфигов')}
   $ tt status                        ${chalk.gray('# Краткий статус всех сервисов (dev по умолчанию)')}
   $ tt status --env stage --failed   ${chalk.gray('# Показать только упавшие сервисы на стейджинге')}

 ${chalk.blue.bold('● Управление одним сервисом:')}
   $ tt start backend --with-deps     ${chalk.gray('# Запустить API вместе с его зависимостями')}
   $ tt restart database --hard       ${chalk.gray('# Жесткий рестарт сервиса с очисткой кэша')}
   $ tt stop storage          	      ${chalk.gray('# Изолированная остановка одного компонента')}

 ${chalk.blue.bold('● Глобальное управление инфрой:')}
   $ tt start --all --env dev         ${chalk.gray('# Поднять весь локальный стек разработки')}
   $ tt stop --all --env stage        ${chalk.gray('# Остановить все сервисы на стейджинге (требует подтверждения)')}

${chalk.dim('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')}
${chalk.gray(`Репозиторий: ${ENV.SOURCE_REPOSITORY}`)}
`,
    },
};
