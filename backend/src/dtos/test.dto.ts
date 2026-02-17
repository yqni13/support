import { DemoMode } from "../utils/enums/demo-mode.enum";

export interface TestErrorDTO {
    error: string,
    errorMsg?: string
}

export interface TestDemoDTO {
    demo_mode?: DemoMode
}