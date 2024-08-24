import { useState } from "react";

import { connectionAPIPost } from "../../../shared/functions/connection/connectionAPI";
import { useGlobalReducer } from "../../../store/reducers/globalReducer/useGlobalReducer";
import { InsertUser } from "../../../shared/dto/InsertUser.dto";
import { validateUser } from "../../../shared/functions/formValidation/formValidation";
import { URL_USER } from "../../../shared/constants/urls";
import { NotificationEnum } from "../../../shared/types/NotificationType";


export const useInsertUsers = () => {
    const {setNotification} = useGlobalReducer();
    const [errors, setErrors] = useState<Partial<InsertUser>>({});
    const [userInsert, setUserInsert] = useState<InsertUser>({
        first_name: "",
        last_name: "",
        email: "",
        uf: ""
    });

    const handleInsert = (e: React.FormEvent, setLoading: any) => {
        e.preventDefault();
        const validationForm = validateUser(userInsert);
        if(Object.keys(validationForm).length > 0){
            setErrors(validationForm);
            return;
        }
        setLoading(true);
        connectionAPIPost(URL_USER, userInsert)
        .catch((error: Error) => {
            setNotification(error.message, NotificationEnum.ERROR);
        })
        .finally(() => setLoading(false));
    }

    // INPUT EVENT
    const onChange = (event: React.ChangeEvent<HTMLInputElement>, nameObject: string) => {
        setUserInsert({
            ...userInsert,
            [nameObject]: event.target.value
        })
    }

    // SELECT EVENT
    const handleChangeSelect = (value: string, nameObject: string) => {
        setUserInsert({
            ...userInsert,
            [nameObject]: nameObject == 'uf' ? value : Number(value)
        })
    } 

    return{
        userInsert,
        errors,
        handleInsert,
        onChange,
        handleChangeSelect
    }
}