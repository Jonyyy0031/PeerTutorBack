import { BaseEntity } from "./api.types";

type Status = 'active' | 'inactive';

export default interface Subject extends BaseEntity {
    name: string;
    department: string;
    status: Status
 }

 export default interface createSubjectDTO {
     name: string;
     department: string;
     status: Status
 }