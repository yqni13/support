import { DemoMode } from "../utils/enums/demo-mode.enum";

export interface ErrorDTO {
    error: string,
    errorMsg?: string
}

export interface DemoDTO {
    demo_mode?: DemoMode
}