type Status = 'active' | 'inactive';

export default interface Tutor {
    id_tutor: number;
    name: string;
    email: string;
    phone: string;
    department: string;
    status: Status;
    created_at: Date;
}

export default interface CreateTutorDTO {
    name: string;
    email: string;
    phone: string;
    department: string;
    status: Status;
}