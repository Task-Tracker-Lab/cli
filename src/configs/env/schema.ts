import z from 'zod/v4';

export const ENV_SCHEMA = z.object({
    SOURCE_REPOSITORY: z
        .string({
            error: 'URL исходного репозитория обязателен',
        })
        .url('Введите корректный URL (например, https://github.com/...)')
        .nonempty('Поле не может быть пустым')
        .describe('Ссылка на публичный GitHub репозиторий проекта ttopen core'),
    VERSION: z
        .string()
        .default(process.env.npm_package_version ?? '1.0.0')
        .describe('Версия CLI приложения'),
});

export type Config = z.infer<typeof ENV_SCHEMA>;
