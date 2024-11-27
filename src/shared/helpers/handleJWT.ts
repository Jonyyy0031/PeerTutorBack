import jwt, { JwtPayload } from 'jsonwebtoken';

import { User } from '../models/user.types';


const secret = process.env.JWT_SECRET || 'default_secret';

export const generateToken = async (user: User): Promise<string> => {
  const token = await jwt.sign(
    {
      id: user.id,
      user_name: user.user_name,
      email: user.email,
      role: user.roleName
    },
    secret,
    { expiresIn: '24h' }
  );
  console.log(token);
  return token;
};

export const validateJWT = (token: string) => {
  try {
    const decoded = jwt.verify(token, secret) as JwtPayload;
    console.log(decoded);
    return decoded;
  } catch (error) {
    return null;
  }
}
