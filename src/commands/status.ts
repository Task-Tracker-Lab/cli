import { Command } from 'commander';
import { logger } from '../utils/logger.js';
import { handleError } from '../utils/handle-error.js';
import { execa } from 'execa';
import { highlighter } from '../utils/highlighter.js';
import { spinner } from '../utils/spinner.js';

interface StatusOptions {
    group?: string;
    failedOnly?: boolean;
    json?: boolean;
}

interface SwarmService {
    ID: string;
    Name: string;
    Mode: string;
    Replicas: string;
    Image: string;
    Ports: string;
}

const filterByGroup = <T extends SwarmService>(
    services: T[],
    group?: string,
): T[] => {
    if (!group) return services;
    return services.filter((s) => s.Name.startsWith(`${group}_`));
};

const filterFailedOnly = <T extends SwarmService>(services: T[]): T[] => {
    return services.filter((s) => {
        const [actual, desired] = s.Replicas.split('/').map(Number);
        if (Number.isNaN(actual) || Number.isNaN(desired)) return false;
        return actual < desired;
    });
};

const getServices = async (options: StatusOptions) => {
    const { stdout } = await execa('docker', [
        'service',
        'ls',
        '--format',
        '{{json .}}',
    ]);

    if (!stdout.trim()) return [];

    let services: SwarmService[] = stdout
        .trim()
        .split('\n')
        .map((line) => JSON.parse(line));

    if (options.group) services = filterByGroup(services);

    if (options.failedOnly) services = filterFailedOnly(services);

    return services;
};

const parseReplicas = (replicas: string) => {
    const parts = replicas.split('/').map(Number);
    return {
        actual: parts[0] || 0,
        desired: parts[1] || 0,
    };
};

const printServicesDashboard = (services: SwarmService[], max: number) => {
    logger.log(
        '\n┌────────────────────────────────────────────────────────────┐',
    );
    logger.log(
        '│              Мониторинг сервисов infraestructura           │',
    );
    logger.log(
        '└────────────────────────────────────────────────────────────┘\n',
    );

    for (const service of services) {
        const { actual, desired } = parseReplicas(service.Replicas);

        let statusColor = highlighter.success();
        let statusIcon = '●';
        let statusText = 'Активен';

        if (actual === 0 && desired > 0) {
            statusColor = highlighter.error();
            statusIcon = '◌';
            statusText = 'Упал';
        } else if (actual < desired) {
            statusColor = highlighter.warn();
            statusIcon = '▲';
            statusText = 'Деградация';
        }

        const paddedName = service.Name.padEnd(max);
        const replicasInfo = `${highlighter.info()}(${service.Replicas})${highlighter.reset()}`;
        const portsInfo = service.Ports ? ` → ${service.Ports}` : '';

        logger.log(
            `  ${statusColor}${statusIcon}${highlighter.reset()}  ${paddedName}  ${replicasInfo.padEnd(25)} ${highlighter.muted()}│${highlighter.reset()}  ${statusColor}${statusText.padEnd(12)}${highlighter.reset()}${highlighter.muted()}${portsInfo}${highlighter.reset()}`,
        );
    }

    logger.log(
        `\n${highlighter.muted()}──────────────────────────────────────────────────────────────${highlighter.reset()}\n`,
    );
};

export const statusCommand = new Command()
    .name('status')
    .description('Показать статус инфраструктуры и сервисов')
    .argument(
        '[service]',
        'Имя конкретного микросервиса (для глубокого анализа)',
    )
    .option(
        '-g, --group <name>',
        'Фильтр по группе/пространству сервисов (например: backend)',
    )
    .option(
        '--failed-only',
        'Показать ТОЛЬКО упавшие или деградировавшие сервисы',
        false,
    )
    .option('-j, --json', 'Выгрузить полный слепок статуса инфры в JSON', false)
    .action(async (service: string | undefined, options: StatusOptions) => {
        const isJsonMode = !!options.json;
        const spin = spinner('Получение данных Docker Swarm...', {
            silent: isJsonMode,
        });

        try {
            if (!isJsonMode) spin.start();

            const services = await getServices({
                ...options,
                group: undefined,
            });

            if (service) {
                const foundService = services.find(
                    (s) => s.Name === service || s.Name.endsWith(`_${service}`),
                );

                if (!foundService) {
                    if (!isJsonMode) {
                        spin.fail(
                            `Сервис "${service}" не найден в Docker Swarm.`,
                        );
                        if (options.group)
                            logger.log(
                                highlighter.muted(
                                    `Подсказка: активен фильтр...`,
                                ),
                            );
                    }
                    return;
                }

                const { stdout: psOutput } = await execa('docker', [
                    'service',
                    'ps',
                    foundService.Name,
                    '--no-trunc',
                ]);

                if (!isJsonMode) {
                    spin.succeed(
                        `Данные сервиса ${foundService.Name} успешно получены`,
                    );
                    logger.break();
                    logger.log(psOutput);
                } else {
                    logger.log(
                        JSON.stringify(
                            { service: foundService, ps: psOutput },
                            null,
                            2,
                        ),
                    );
                }
                return;
            }

            let filteredServices = options.group
                ? services.filter((s) => s.Name.startsWith(`${options.group}_`))
                : services;

            if (options.failedOnly) {
                filteredServices = filteredServices.filter((s) => {
                    const [actual, desired] = s.Replicas.split('/').map(Number);
                    return (
                        !Number.isNaN(actual) &&
                        !Number.isNaN(desired) &&
                        actual < desired
                    );
                });
            }

            if (isJsonMode) {
                logger.log(JSON.stringify(filteredServices, null, 2));
                return;
            }

            if (services.length === 0) {
                spin.warn('Нет запущенных сервисов, соответствующих фильтрам.');
                return;
            }

            spin.succeed('Данные инфраструктуры обновлены');

            const maxNameLength = Math.max(
                ...filteredServices.map((s) => s.Name.length),
                15,
            );
            printServicesDashboard(filteredServices, maxNameLength);
        } catch (err) {
            if (!isJsonMode) {
                spin.fail('Не удалось получить статус инфраструктуры');
                handleError(err);
            } else {
                logger.error(
                    JSON.stringify({
                        error: 'Retrieval failed',
                        details: String(err),
                    }),
                );
                process.exit(1);
            }
        }
    });
