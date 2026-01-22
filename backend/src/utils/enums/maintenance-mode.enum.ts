export type MaintenanceMode = 'A-000' | 'E-013' | 'M-008' | 'T-011';

export const MaintenanceMode = {
    A000: 'A-000' as MaintenanceMode, // application working
    E013: 'E-013' as MaintenanceMode, // application blocked (ERROR)
    M008: 'M-008' as MaintenanceMode, // application blocked (ERROR_MAINTENANCE)
    T011: 'T-011' as MaintenanceMode, // application blocked (ERROR_TRAFFIC)
}