export type MaintenanceMode = 'A-008' | 'D-013' | 'E-000';

export const MaintenanceMode = {
    A008: 'A-008' as MaintenanceMode, // application blocked (in maintenance)
    D013: 'D-013' as MaintenanceMode, // application blocked (error)
    E000: 'E-000' as MaintenanceMode  // application working
}