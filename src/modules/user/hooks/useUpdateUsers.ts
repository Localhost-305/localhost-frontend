import { useState } from "react";
import { useGlobalReducer } from "../../../store/reducers/globalReducer/useGlobalReducer";
import { UpdateUser } from "../../../shared/dto/UpdateUser.dto";
import { validateUserUpdate } from "../../../shared/functions/formValidation/formValidation";
import { connectionAPIPut } from "../../../shared/functions/connection/connectionAPI";
import { URL_USER } from "../../../shared/constants/urls";
import { NotificationEnum } from "../../../shared/types/NotificationType";
import { UserType } from "../../../shared/types/UserType";

export const useUpdateUsers = () => {
    const {setNotification} = useGlobalReducer();
    const [errors, setErrors] = useState<Partial<UpdateUser>>({});
    const [userUpdate, setUserUpdate] = useState<UpdateUser>({
        name: "",
        email: "",
        roleId: "",
    });

    const handleUpdate = (selectedUser: UserType, setLoading: any) => {        
        const validationForm = validateUserUpdate(userUpdate);
        if(Object.keys(validationForm).length > 0){
            setErrors(validationForm);
            return;
        }
        setLoading(true);
        try{
            console.log(userUpdate)
            connectionAPIPut(`${URL_USER}/${selectedUser.userId}`, userUpdate);
            if(userUpdate.roleId != "") connectionAPIPut(`${URL_USER}/${selectedUser.userId}/role`, userUpdate.roleId);
        }catch(error){
            setNotification(String(error), NotificationEnum.ERROR);
        }finally{
            setLoading(false);
        }
    }

    // INPUT EVENT
    const onChange = (event: React.ChangeEvent<HTMLInputElement>, nameObject: string) => {
        setUserUpdate({
            ...userUpdate,
            [nameObject]: event.target.value
        })
    }

    // SELECT EVENT
    const handleChangeSelect = (value: string) => {
        setUserUpdate({
            ...userUpdate,
            ['roleId']: value
        })
    } 

    return{
        userUpdate,
        errors,
        handleUpdate,
        onChange,
        setUserUpdate,
        handleChangeSelect
    }
}