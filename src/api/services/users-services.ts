import { User, CreateUserDTO } from '../../shared/models/user.types';
import { Database } from '../../config/dbConnection';
import { validateDBUserEmail, validateDBUserName, validateEmail, validateNameUser, validatePassword } from '../../shared/helpers/validators';
import { DatabaseError, ValidationError } from '../../shared/errors/AppErrors';
import { generateToken } from '../../shared/helpers/handleJWT';
import { comparePassword, hashPassword } from '../../shared/helpers/handlebcrypt';

export class UserService {
    async getAllUsersWithRol(): Promise<User[]> {
        console.log("Getting users");
        const query =
            `SELECT u.id, u.user_name, u.email, u.role_id, r.roleName
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
        const query = `
        SELECT u.id, u.user_name, u.email, r.roleName
        FROM user as u
        INNER JOIN role as r ON u.role_id = r.id
        WHERE u.id = ?`;
        const user = await Database.query<User[]>(query, [id]);
        return user[0];
    }

    async getUserPassword (email: string): Promise<string> {
        const query = `SELECT password FROM user WHERE email = ?`;
        const [user] = await Database.query<{password: string}[]>(query, [email]);
        return user.password;
    }

    async createUser(userData: CreateUserDTO): Promise<User> {
        return Database.transaction(async (connection) => {
            try {
                validateNameUser(userData.user_name);
                validateEmail(userData.email);
                validatePassword(userData.password);
                const isNameUnique = await validateDBUserName(userData.user_name);
                if (!isNameUnique) throw new ValidationError('El nombre de usuario ya existe');

                const isEmailUnique = await validateDBUserEmail(userData.email);
                if (!isEmailUnique) throw new ValidationError('El email ya existe');

                userData.password = await hashPassword(userData.password);

                const query = `INSERT INTO user (user_name, email, password, role_id) VALUES (?, ?, ? ,?)`;
                const [userCreated] = await connection.execute(query,
                    [userData.user_name, userData.email, userData.password, userData.role_id]
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
                throw new DatabaseError('Error inesperado al crear usuario ' + error);
            }
        });
    }

    async updateUser(id: number, userData: Partial<CreateUserDTO>): Promise<User> {
        console.log("Updating user");
        return Database.transaction(async (connection) => {
            try {
                if (userData.user_name !== undefined) validateNameUser(userData.user_name);
                if (userData.email !== undefined) validateEmail(userData.email);
                if (userData.password !== undefined) {
                    validatePassword(userData.password);
                    userData.password = await hashPassword(userData.password);
                };
                if (userData.user_name !== undefined) {
                    const isNameUnique = await validateDBUserName(userData.user_name, id);
                    if (!isNameUnique) throw new ValidationError('El nombre de usuario ya existe');
                }
                if (userData.email !== undefined) {
                    const isEmailUnique = await validateDBUserName(userData.email, id);
                    if (!isEmailUnique) throw new ValidationError('El email ya existe');
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
                throw new DatabaseError('Error inesperado al actualizar usuario ' + error);
            }
        });
    }

    async deleteUser(id: number): Promise<boolean> {
        console.log("Deleting user");
        const result = await Database.query<any>(`DELETE FROM user WHERE id = ?`, [id]);
        return result.affectedRows > 0;
    }

    async login(email: string, password: string): Promise<{user: Partial<User>, token: string}> {
        console.log("Logging in");
        try {
            const query = `
            SELECT u.id, u.user_name, u.email, u.password, r.roleName
            FROM user as u
            INNER JOIN role as r ON u.role_id = r.id
            WHERE u.email = ?`;
            const [user] = await Database.query<User[]>(query, [email]);
            if (!user) throw new ValidationError('El email no tiene una cuenta asociada');

            const isPasswordValid = await comparePassword(password, user.password);
            if (!isPasswordValid) throw new ValidationError('La contraseña es incorrecta');

            const token = await generateToken(user);
            const { password: _, ...userData } = user;
            return { user: userData, token };

        } catch (error: any) {
            if (error instanceof ValidationError) {
                throw error;
            }
            throw new DatabaseError('Error inesperado al iniciar sesión ' + error);
        }
    }
}