type Status = 'accepted' | 'pending' | 'rejected';

export interface Log {
    id_log: number;
    NameStudent: string;
    Group: string;
    id_tutor: number;
    id_tutor_subject: number;
    status: Status;
}