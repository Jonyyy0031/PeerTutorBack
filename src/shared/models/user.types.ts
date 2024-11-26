import { BaseEntity } from './api.types';
export interface User extends BaseEntity{
    user_name: string;
    email: string;
    password: string;
    role: string;
}

export interface CreateUserDTO {
    user_name: string;
    email: string;
    password: string;
    role_id: number;
}