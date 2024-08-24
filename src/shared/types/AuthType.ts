import { UserType } from "./UserType";

export interface AuthType {
    tokenJWT: string;
    user: UserType;
}