export interface ApiResponse<T> {
    data: T;
    status: number;
    message?: string;
}

export interface BaseEntity {
    id: number;
}