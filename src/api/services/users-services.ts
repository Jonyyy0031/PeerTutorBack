import { User, CreateUserDTO } from '../../shared/models/user.types';
import { Database } from '../../config/dbConnection';
import { validateDBUserEmail, validateDBUserName, validateEmail, validateNameUser, validatePassword } from '../../shared/helpers/validators';
import { DatabaseError, ValidationError } from '../../shared/errors/AppErrors';

export class UserService {
    async getAllUsersWithRol(): Promise<User[]> {
        console.log("Getting users");
        const query =
            `SELECT u.id, u.name, u.email, r.roleName
        FROM user as u
        INNER JOIN role as r ON u.role_id = r.id`;
        const users = await Database.query<User[]>(query);
        return users;
    }

    async getAllRoles(): Promise<string[]> {
        console.log("Getting roles");
        const query = `SELECT * FROM role`;
        const roles = await Database.query<string[]>(query);
        return roles;
    }

    async getUserById(id: number): Promise<User> {
        console.log("Getting user by id");
        const query = `SELECT * FROM user WHERE id = ?`;
        const user = await Database.query<User[]>(query, [id]);
        return user[0];
    }

    async createUser(userData: CreateUserDTO): Promise<User> {
        return Database.transaction(async (connection) => {
            try {
                validateNameUser(userData.name);
                validateEmail(userData.email);
                const isNameUnique = await validateDBUserName(userData.name);
                if (!isNameUnique) throw new ValidationError('Nombre ya registrado');

                const isEmailUnique = await validateDBUserEmail(userData.email);
                if (!isEmailUnique) throw new ValidationError('Email ya registrado');

                const query = `INSERT INTO user (name, email, password, role_id) VALUES (?, ?, ? ,?)`;
                const [userCreated] = await connection.execute(query,
                    [userData.name, userData.email, userData.password, userData.role_id]
                );
                let userId = Database.getInsertId(userCreated);

                return this.getUserById(userId);
            } catch (error: any) {
                if (error instanceof ValidationError) {
                    throw error;
                }
                if (error instanceof DatabaseError) {
                    throw error;
                }
                throw new DatabaseError('Error inesperado al crear usuario');
            }
        });
    }

    async updateUser(id: number, userData: Partial<CreateUserDTO>): Promise<User> {
        console.log("Updating user");
        return Database.transaction(async (connection) => {
            try {
                if (userData.name !== undefined) validateNameUser(userData.name);
                if (userData.email !== undefined) validateEmail(userData.email);
                if (userData.password !== undefined) validatePassword(userData.password);
                if (userData.name !== undefined) {
                    const isNameUnique = await validateDBUserName(userData.name, id);
                    if (!isNameUnique) throw new ValidationError('Nombre ya registrado');
                }
                if (userData.email !== undefined) {
                    const isEmailUnique = await validateDBUserName(userData.email, id);
                    if (!isEmailUnique) throw new ValidationError('Email ya registrado');
                }
                const setClause = Object.keys(userData)
                    .map(key => `${key} = ?`)
                    .join(', ');
                const query = `UPDATE user SET ${setClause} WHERE id = ?`;
                await connection.execute(query, [...Object.values(userData), id]);
                return this.getUserById(id);
            } catch (error) {
                if (error instanceof ValidationError) {
                    throw error;
                }
                if (error instanceof DatabaseError) {
                    throw error;
                }
                throw new DatabaseError('Error inesperado al actualizar usuario');
            }
        });
    }

    async deleteUser(id: number): Promise<boolean> {
        console.log("Deleting user");
        const result = await Database.query<any>(`DELETE FROM user WHERE id = ?`, [id]);
        return result.affectedRows > 0;
    }
}