import { generateToken, validateJWT } from "../shared/helpers/handleJWT";
import { User } from "../shared/models/user.types";

describe('JWT Validation', () =>{
    const exampleUser: User = {
        id: 1,
        user_name: 'test',
        email: 'test@example.com',
        roleName: 'admin',
        password: '123'
    }

    test('should generate a valid token', async () => {
        const token = await generateToken(exampleUser);
        const decoded = await validateJWT(token)
        expect(decoded).toBeTruthy();
        expect(decoded).toMatchObject({
            id: exampleUser.id,
            user_name: exampleUser.user_name,
            email: exampleUser.email,
            roleName: exampleUser.roleName
        })
    })
})