export default interface Subject {
    id_subject: string;
    name: string;
    department: string;
    created_at: Date;
 }

 export default interface createSubjectDTO {
     name: string;
     department: string;
 }