export type DemoLimitId = number & { readonly brand: unique symbol };

export interface DemoLimits {
    demo_limit_id: DemoLimitId,
    day: string,
    count: number,
    last_modified: string
}