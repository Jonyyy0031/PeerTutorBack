type Status = 'accepted' | 'pending' | 'rejected';

export default interface Log {
    NameStudent: string;
    Group: string;
    id_tutor: number;
    id_tutor_subject: number;
    status: Status;
    created_at: Date;
}

export default interface CreateLogDTO {
    NameStudent: string;
    Group: string;
    id_tutor: number;
    id_tutor_subject: number;
    status: Status;
}
