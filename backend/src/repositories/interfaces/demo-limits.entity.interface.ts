export type DemoLimitsId = number & { readonly brand: unique symbol };

export interface DemoLimits {
    demo_limit_id: DemoLimitsId,
    day: string,
    count: number,
    last_modified: string
}