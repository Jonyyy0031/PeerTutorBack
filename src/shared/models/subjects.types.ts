import { BaseEntity } from "./api.types";

type Status = 'active' | 'inactive';

export default interface Subject extends BaseEntity {
    subject_name: string;
    department: string;
    status: Status
 }

 export default interface createSubjectDTO {
     subject_name: string;
     department: string;
     status: Status
 }