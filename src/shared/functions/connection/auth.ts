import { NavigateFunction, redirect } from "react-router-dom";

import { AUTHORIZARION_KEY, NAME } from "../../constants/authorizationConstants";
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