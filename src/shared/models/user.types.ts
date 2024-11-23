import { BaseEntity } from './api.types';
export interface User extends BaseEntity{
    name: string;
    email: string;
    password: string;
    role: string;
}

export interface CreateUserDTO {
    name: string;
    email: string;
    password: string;
    role_id: number;
}