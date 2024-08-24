import { RouteObject } from "react-router-dom";

import LoginScreen from "./screens/LoginScreen";

export enum LoginRoutesEnum{
  LOGIN = '/login',
  RECOVER_PASSWORD = '/recuperar-senha',
  REDEFINE_PASSWORD = '/redefinir-senha'
}

export const loginRoutes: RouteObject[] = [
    {
      path: LoginRoutesEnum.LOGIN,
      element: <LoginScreen/>,
    }
];