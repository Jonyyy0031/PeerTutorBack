import { BaseEntity } from "./api.types";

type Status = 'accepted' | 'pending' | 'rejected';
type DayOfWeek = 'Lunes' | 'Martes' | 'Miercoles' | 'Jueves' | 'Viernes';

export interface Schedule {
    day: DayOfWeek;
    hour: string;
}

export interface Log extends BaseEntity {
    student_name: string;
    student_group: string;
    tutor_id: number;
    subject_id: number;
    status: Status;
    schedules: Schedule;
}

export interface CreateLogDTO {
    student_name: string;
    student_group: string;
    tutor_id: number;
    subject_id: number;
    schedules: Schedule;
}
