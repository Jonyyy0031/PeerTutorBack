import {Request, Response} from 'express';
import {TutorsService} from '../services/tutors-service';

export class TutorController {

    constructor(private tutorsService: TutorsService = new TutorsService()) {
    }

    getTutors = async (req: Request, res: Response) => {
        try {
            const tutors = await this.tutorsService.getAllTutors();
            res.json(tutors);
        } catch (error) {
            res.status(500).json({
                message: 'Error getting tutors',
                error: (error)
            });
            console.log(error);
        }
    }
}