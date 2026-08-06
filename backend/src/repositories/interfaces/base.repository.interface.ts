export interface BaseRepository<T> {
    findById(id: string | number): Promise<T | null>;
    update(id: string | number, dto: Partial<T>): Promise<T | null>;
}

export interface FindRepository<T> {
    findAll(): Promise<T[] | null>;
}

export interface CreateRepository<T> {
    create(entity: T): Promise<T>;
}

export interface UpdateFlagRepository<T> {
    updateFlag(id: string | number, dto: Partial<T>): Promise<T | null>;
}

export interface DeleteRepository {
    delete(id: string | number): Promise<boolean>;
}