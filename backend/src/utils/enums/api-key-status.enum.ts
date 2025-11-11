export type ApiKeyStatus = 'active' | 'disabled' | 'expired';

export const ApiKeyStatus = {
    ACTIVE: 'active' as ApiKeyStatus,
    DISABLED: 'disabled' as ApiKeyStatus,
    EXPIRED: 'expired' as ApiKeyStatus
}