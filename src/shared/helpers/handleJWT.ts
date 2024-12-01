import jwt from 'jsonwebtoken';
import { Payload } from '../models/jwt.types';
import { User } from '../models/user.types';

const secret = process.env.JWT_SECRET || 'asd';

export const generateToken = async (user: User): Promise<string> => {
  return await jwt.sign(
    {
      id: user.id,
      user_name: user.user_name,
      email: user.email,
      roleName: user.roleName
    },
    secret,
    { expiresIn: '1h' }
  );

};

export const validateJWT = (token: string) => {
  try {
    const decoded = jwt.verify(token, secret) as Payload;
    return decoded;
  } catch (error) {
    return null;
  }
}
