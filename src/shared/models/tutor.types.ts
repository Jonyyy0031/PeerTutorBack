import { BaseEntity } from "./api.types";
import Subject from "./subjects.types";

type Status = 'active' | 'inactive';
type Shift = 'matutino' | 'vespertino';

export default interface Tutor extends BaseEntity {
    tutor_name: string;
    email: string;
    phone: string;
    department: string;
    status: Status;
    shift: Shift
    subjectIds: Subject[];
}

export default interface CreateTutorDTO {
    tutor_name: string;
    email: string;
    phone: string;
    department: string;
    status: Status;
    shift: Shift;
}