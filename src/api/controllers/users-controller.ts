import { Request, Response } from 'express';
import { UserService } from '../services/users-services';
import { CreateUserDTO, User } from '../../shared/models/user.types';

export class UserController {

    constructor(private userService: UserService = new UserService()) {
    }

    getUsers = async (req: Request, res: Response): Promise<void> => {
        try {
            const users = await this.userService.getAllUsers();
            res.json(users);
        } catch (error) {
            res.status(500).json({
                message: 'Error getting users',
                error: (error)
            });
        }
    }

    getUserById = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = parseInt(req.params.id);
            const user = await this.userService.getUserById(id);

            if (!user) {
                res.status(404).json({
                    message: 'User not found'
                });
                return;
            }

            res.json(user);

        } catch (error) {
            res.status(500).json({
                message: 'Error getting user',
                error: (error)
            });
        }
    }

    createUser = async (req: Request, res: Response): Promise<void> => {
        try {
            const userData: CreateUserDTO = req.body;
            const newUser = await this.userService.createUser(userData);
            res.status(201).json(newUser);
        } catch (error) {
            res.status(500).json({
                message: 'Error creating user',
                error: (error)
            });
        }
    }
    updateUser = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = parseInt(req.params.id);
            const userData: Partial<CreateUserDTO> = req.body;
            const updatedUser = await this.userService.updateUser(id, userData);

            if (!updatedUser) {
                res.status(404).json({
                    message: 'User not found'
                });
                return;
            }

            res.json(updatedUser);
        } catch (error) {
            res.status(500).json({
                message: 'Error updating user',
                error: (error)
            });
        }
    }

    deleteUser = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = parseInt(req.params.id);
            const deleted = await this.userService.deleteUser(id);

            if (!deleted) {
                res.status(404).json({
                    message: 'User not found'
                });
                return;
            }

            res.json({
                message: 'User deleted'
            });
        } catch (error) {
            res.status(500).json({
                message: 'Error deleting user',
                error: (error)
            });
        }
    }
}

export default UserController;