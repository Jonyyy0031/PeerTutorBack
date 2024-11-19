type Status = 'active' | 'inactive';

export default interface Subject {
    id_subject: string;
    name: string;
    department: string;
    status: Status
 }

 export default interface createSubjectDTO {
     name: string;
     department: string;
     status: Status
 }