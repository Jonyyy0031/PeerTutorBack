import Subject from "./subjects.types";

type Status = 'active' | 'inactive';

export default interface Tutor {
    id_tutor: number;
    name: string;
    email: string;
    phone: string;
    department: string;
    status: Status;
    subjects: Subject[];
}

export default interface CreateTutorDTO {
    name: string;
    email: string;
    phone: string;
    department: string;
    status: Status;
}