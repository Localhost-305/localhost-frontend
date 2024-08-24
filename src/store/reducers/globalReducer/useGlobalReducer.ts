import { useDispatch } from "react-redux"
import { useAppSelector } from "../../hooks";
import { setNotificationAction, setUserAction } from ".";
import { NotificationEnum } from "../../../shared/types/NotificationType";
import { UserType } from "../../../shared/types/UserType";

export const useGlobalReducer = () => {
    const dispatch = useDispatch();
    const { user, notification } = useAppSelector((state) => state.globalReducer);

    const setNotification = (message: string, type: NotificationEnum, reload?: boolean, description?: string) => {
        dispatch(
            setNotificationAction({
                message,
                type,
                description
            })
        )
        if(reload) setTimeout(() => window.location.reload(), 1500)
    }
    

    const setUser = (user: UserType) => { dispatch(setUserAction(user)) };

    return{
        user,
        notification,
        setNotification,
        setUser
    }
}