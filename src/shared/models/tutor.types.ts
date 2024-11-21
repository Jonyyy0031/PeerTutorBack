import { BaseEntity } from "./api.types";
import Subject from "./subjects.types";

type Status = 'active' | 'inactive';

export default interface Tutor extends BaseEntity {
    name: string;
    email: string;
    phone: string;
    department: string;
    status: Status;
    subjectIds: Subject[];
}

export default interface CreateTutorDTO {
    name: string;
    email: string;
    phone: string;
    department: string;
    status: Status;
}