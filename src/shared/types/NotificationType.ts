export enum NotificationEnum {
   SUCCESS = 'success',
   INFO = 'info',
   WARNING = 'warning',
   ERROR = 'error'
}
export interface NotificationType{
    message: string;
    type: NotificationEnum;
    description?: string;
}