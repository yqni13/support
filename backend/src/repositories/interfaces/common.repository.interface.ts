export interface BaseQuery {
    sql: string,
    values: any[]
}

export interface TimestampFilters {
    last_modified?: string[],
    created_on?: string[]
}