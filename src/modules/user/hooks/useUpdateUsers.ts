import { useState } from "react";
import { useGlobalReducer } from "../../../store/reducers/globalReducer/useGlobalReducer";
import { InsertUser } from "../../../shared/dto/InsertUser.dto";
import { UpdateUser } from "../../../shared/dto/UpdateUser.dto";
import { validateUserUpdate } from "../../../shared/functions/formValidation/formValidation";
import { connectionAPIPost } from "../../../shared/functions/connection/connectionAPI";
import { URL_USER } from "../../../shared/constants/urls";
import { NotificationEnum } from "../../../shared/types/NotificationType";

export const useUpdateUsers = () => {
    const {setNotification} = useGlobalReducer();
    const [errors, setErrors] = useState<Partial<InsertUser>>({});
    const [userInsert, setUserInsert] = useState<UpdateUser>({
        name: "",
        email: ""
    });

    const handleInsert = (e: React.FormEvent, setLoading: any) => {
        e.preventDefault();
        const validationForm = validateUserUpdate(userInsert);
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