import { User, CreateUserDTO } from '../../shared/models/user.types';
import { Database } from '../../config/dbConnection';
import { validateDBUserName, validateEmail, validateName, validatePassword } from '../../shared/helpers/validators';

export class UserService {
    async getAllUsers(): Promise<User[]> {
        console.log("Getting users");
        const query = `SELECT * FROM user`;
        const users = await Database.query<User[]>(query);
        return users;
    }

    async getUserById(id: number): Promise<User> {
        console.log("Getting user by id");
        const query = `SELECT * FROM user WHERE id = ?`;
        const user = await Database.query<User[]>(query, [id]);
        return user[0];
    }

    async getUserByRoleId(id: number, email: string): Promise<boolean> {
        console.log("Getting user by role id");
        const query =
        `select count(*) as count
         from rol as r inner join user as u on r.id = u.rol_id
         where u.rol_id = ? and u.email = ?`
        const [result] = await Database.query<[{count: number}]>(query, [id, email]);
        return result.count > 0;
    }

    async createUser(userData: CreateUserDTO): Promise<User> {
        return Database.transaction(async (connection) => {
            if (!validateName(userData.name)) throw new Error('Nombre de usuario inválido');
            if (!validateEmail(userData.email)) throw new Error('Email inválido');
            if (!validatePassword(userData.password)) throw new Error('Contraseña inválida');

            const isNameUnique = await validateDBUserName(userData.name);
            if (!isNameUnique) throw new Error('Nombre ya registrado');

            const isEmailUnique = await validateDBUserName(userData.email);
            if (!isEmailUnique) throw new Error('Email ya registrado');

            const query = `INSERT INTO user (name, email, password) VALUES (?, ?, ?)`;
            const [userCreated] = await connection.execute(query,
                [userData.name, userData.email, userData.password]
            );
            let userId = Database.getInsertId(userCreated);

            return this.getUserById(userId);
        });
    }

    async updateUser(id: number, userData: Partial<CreateUserDTO>): Promise<User> {
        console.log("Updating user");
        return Database.transaction(async (connection) => {
            if (userData.name !== undefined && !validateName(userData.name)) throw new Error('Nombre de usuario inválido');
            if (userData.email !== undefined && !validateEmail(userData.email)) throw new Error('Email inválido');
            if (userData.password !== undefined && !validatePassword(userData.password)) throw new Error('Contraseña inválida');

            if (userData.name !== undefined) {
                const isNameUnique = await validateDBUserName(userData.name, id);
                if (!isNameUnique) throw new Error('Nombre ya registrado');
            }

            if (userData.email !== undefined) {
                const isEmailUnique = await validateDBUserName(userData.email, id);
                if (!isEmailUnique) throw new Error('Email ya registrado');
            }

            const setClause = Object.keys(userData)
                .map(key => `${key} = ?`)
                .join(', ');
            const query = `UPDATE user SET ${setClause} WHERE id = ?`;
            await connection.execute(query, [...Object.values(userData), id]);

            return this.getUserById(id);
        });
    }

    async deleteUser(id: number): Promise<boolean> {
        console.log("Deleting user");
        const result = await Database.query<any>(`DELETE FROM user WHERE id = ?`, [id]);
        return result.affectedRows > 0;
    }
}