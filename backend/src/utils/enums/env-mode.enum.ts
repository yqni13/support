export type EnvMode = 'development' | 'test' | 'staging' | 'production';

export const EnvMode = {
    DEV: 'development' as EnvMode,
    TEST: 'test' as EnvMode,
    STAG: 'staging' as EnvMode,
    PROD: 'production' as EnvMode
}