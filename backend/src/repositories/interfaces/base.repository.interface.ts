export interface IBaseRepository<T> {
    findById(id: string | number): Promise<T | null>;
    update(id: string | number, dto: Partial<T>): Promise<T | null>;
}

export interface IFindRepository<T> {
    findAll(): Promise<T[] | null>;
}

export interface ICreateRepository<T> {
    create(entity: T): Promise<T>;
}

export interface IDeleteRepository {
    delete(id: string | number): Promise<boolean>;
}

export interface IBaseQuery {
    sql: string,
    values: any[]
}