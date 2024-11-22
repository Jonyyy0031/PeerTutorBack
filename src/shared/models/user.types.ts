import { BaseEntity } from './api.types';
export interface User extends BaseEntity{
    name: string;
    email: string;
    password: string;
    rol_id: number;
}

export interface CreateUserDTO {
    name: string;
    email: string;
    password: string;
    rol_id: number;
}