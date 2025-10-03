import { IRepoError } from "./error.repository.interface";

export interface IBaseRepository<T> {
    findById(id: string | number): Promise<T |  IRepoError | null>;
    update(id: string | number, data: Partial<T>): Promise<T | IRepoError | null>;
}

export interface IFindRepository<T> {
    findAll(): Promise<T[] | IRepoError>;
}

export interface ICreateRepository<T> {
    create(entity: T): Promise<T | IRepoError>;
}

export interface IDeleteRepository {
    delete(id: string | number): Promise<boolean | IRepoError>;
}