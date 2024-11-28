import { JwtPayload } from "jsonwebtoken";

export type Payload = JwtPayload & {
    id: number;
    user_name: string;
    email: string;
    roleName: string;
};