import { NavigateFunction, redirect } from "react-router-dom";

import { AUTHORIZARION_KEY, NAME, PERMISSIONS } from "../../constants/authorizationConstants";
import { getItemStorage, removeItemStorage, setItemStorage } from "./storageProxy";
import { UserType } from "../../types/UserType";
import { connectionAPIGet } from "./connectionAPI";
import { URL_USER } from "../../constants/urls";
import { LoginRoutesEnum } from "../../../modules/login/routes";


export const unsetAuthorizationToken = () => removeItemStorage(AUTHORIZARION_KEY);

export const setAuthorizationToken = (token: string) => {
    if(token){
        setItemStorage(AUTHORIZARION_KEY, token);
    }
}

export const setUserData = (name: string) => {
    if(name) setItemStorage(NAME, name);
}

export const setPermissions = (permissions: string[]) => {
    const permissionsJson = JSON.stringify(permissions)
    if(permissions)  localStorage.setItem(PERMISSIONS, permissionsJson);
}

export const getAuthorizationToken = () => getItemStorage(AUTHORIZARION_KEY);

export const verifyLoggedIn = async () => {
    const token = getAuthorizationToken();
    if(!token){
        return redirect(LoginRoutesEnum.LOGIN);
    }
    const user = await connectionAPIGet<UserType>(URL_USER)
    .catch(() => {
        unsetAuthorizationToken();
    });

    if(!user){
        return redirect(LoginRoutesEnum.LOGIN);
    }
    return null;
}

export const logout = (navigate: NavigateFunction) => {
    unsetAuthorizationToken();
    navigate(LoginRoutesEnum.LOGIN);
}