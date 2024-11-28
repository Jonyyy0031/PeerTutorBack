import jwt from 'jsonwebtoken';
import { Payload } from '../models/jwt.types';
import { User } from '../models/user.types';

const secret = process.env.JWT_SECRET || 'asd';

export const generateToken = async (user: User): Promise<string> => {
  const token = await jwt.sign(
    {
      id: user.id,
      user_name: user.user_name,
      email: user.email,
      roleName: user.roleName
    },
    secret,
    { expiresIn: '1h' }
  );
  return token;
};

export const validateJWT = (token: string) => {
  try {
    const decoded = jwt.verify(token, secret) as Payload;
    return decoded;
  } catch (error) {
    return null;
  }
}
