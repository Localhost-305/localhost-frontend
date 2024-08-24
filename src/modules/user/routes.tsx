import { RouteObject } from "react-router-dom";
import User from "./screens/User";
import UserInsert from "./screens/UserInsert";

export enum UserRoutesEnum{
    USER = '/usuarios',
    USER_INSERT = '/usuarios/inserir'
}

export const userRoutes: RouteObject[] = [
    {
        path: UserRoutesEnum.USER,
        element: <User />
    },
    {
        path: UserRoutesEnum.USER_INSERT,
        element: <UserInsert />
    }
]
   
