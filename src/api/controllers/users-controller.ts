import { Request, Response } from 'express';
import { UserService } from '../services/users-services';
import { CreateUserDTO, User } from '../../shared/models/user.types';
import { DatabaseError, ValidationError } from '../../shared/errors/AppErrors';

export class UserController {

    constructor(private userService: UserService = new UserService()) {
    }

    getUsers = async (req: Request, res: Response): Promise<void> => {
        try {
            const users = await this.userService.getAllUsersWithRol();
            res.status(200).json({
                status: 'success',
                code: 'OK',
                message: 'Usuarios obtenidos',
                data: users
            })
        } catch (error: any) {
            if (error instanceof DatabaseError) {
                res.status(500).json({
                    status: 'error',
                    code: 'DATABASE_ERROR',
                    message: error.message
                });
                return;
            }
            res.status(500).json({
                status: 'error',
                code: 'INTERNAL_SERVER_ERROR',
                message: 'Error interno del servidor'
            });
        }
    }

    getUserById = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = parseInt(req.params.id);
            const user = await this.userService.getUserById(id);

            if (!user) {
                res.status(404).json({
                    status: 'error',
                    code: 'NOT_FOUND',
                    message: 'Usuario no encontrado'
                });
                return;
            }

            res.status(200).json({
                status: 'success',
                code: 'OK',
                message: 'Usuario obtenido',
                data: user
            })

        } catch (error) {
            if (error instanceof DatabaseError) {
                res.status(500).json({
                    status: 'error',
                    code: 'DATABASE_ERROR',
                    message: error.message
                });
                return;
            }
            res.status(500).json({
                status: 'error',
                code: 'INTERNAL_SERVER_ERROR',
                message: 'Error interno del servidor'
            });
        }
    }

    getRoles = async (req: Request, res: Response): Promise<void> => {
        try {
            const roles = await this.userService.getAllRoles();
            res.status(200).json({
                status: 'success',
                code: 'OK',
                message: 'Roles obtenidos',
                data: roles
            })
        } catch (error: any) {
            if (error instanceof DatabaseError) {
                res.status(500).json({
                    status: 'error',
                    code: 'DATABASE_ERROR',
                    message: error.message
                });
                return;
            }
            res.status(500).json({
                status: 'error',
                code: 'INTERNAL_SERVER_ERROR',
                message: 'Error interno del servidor'
            });
        }
    }

    createUser = async (req: Request, res: Response): Promise<void> => {
        try {
            const userData: CreateUserDTO = req.body;
            const newUser = await this.userService.createUser(userData);
            res.status(201).json({
                status: 'success',
                code: 'CREATED',
                message: 'Usuario creado',
                data: newUser
            })
        } catch (error: any) {
            if(error instanceof ValidationError){
                res.status(400).json({
                    status: 'error',
                    code: 'VALIDATION_ERROR',
                    message: error.message
                });
                return;
            }
            if (error instanceof DatabaseError) {
                if (error.message.includes('Ya existe')) {
                    res.status(409).json({
                        status: 'error',
                        code: 'DUPLICATE_ENTRY',
                        message: error.message
                    });
                    return;
                }

                res.status(500).json({
                    status: 'error',
                    code: 'DATABASE_ERROR',
                    message: error.message
                });
                return;
            }
            res.status(500).json({
                status: 'error',
                code: 'INTERNAL_SERVER_ERROR',
                message: 'Error interno del servidor'
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
                    status: 'error',
                    code: 'NOT_FOUND',
                    message: 'Usuario no encontrado'
                });
                return;
            }

            res.status(200).json({
                status: 'success',
                code: 'UPDATED',
                message: 'Usuario actualizado',
                data: updatedUser
            })
        } catch (error: any) {
            if(error instanceof ValidationError){
                res.status(400).json({
                    status: 'error',
                    code: 'VALIDATION_ERROR',
                    message: error.message
                });
                return;
            }
            if (error instanceof DatabaseError) {
                if (error.message.includes('Ya existe')) {
                    res.status(409).json({
                        status: 'error',
                        code: 'DUPLICATE_ENTRY',
                        message: error.message
                    });
                    return;
                }
                res.status(500).json({
                    status: 'error',
                    code: 'DATABASE_ERROR',
                    message: error.message
                });
                return;
            }
            res.status(500).json({
                status: 'error',
                code: 'INTERNAL_SERVER_ERROR',
                message: 'Error interno del servidor'
            });
        }
    }

    deleteUser = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = parseInt(req.params.id);
            const deleted = await this.userService.deleteUser(id);

            if (!deleted) {
                res.status(404).json({
                    status: 'error',
                    code: 'NOT_FOUND',
                    message: 'Usuario no encontrado'
                });
                return;
            }
            res.status(200).json({
                status: 'success',
                code: 'DELETED',
                message: 'Usuario eliminado'
            });
        } catch (error: any) {
            if (error instanceof DatabaseError) {
                res.status(500).json({
                    status: 'error',
                    code: 'DATABASE_ERROR',
                    message: error.message
                });
                return;
            }
            res.status(500).json({
                status: 'error',
                code: 'INTERNAL_SERVER_ERROR',
                message: 'Error interno del servidor'
            });
        }
    }
}

export default UserController;