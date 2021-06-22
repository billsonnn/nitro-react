import { Dispatch, ProviderProps } from 'react';
import { INotificationCenterAction, INotificationCenterState } from '../reducers/NotificationCenterReducer';

export interface INotificationCenterContext
{
    notificationCenterState: INotificationCenterState;
    dispatchNotificationCenterState: Dispatch<INotificationCenterAction>;
}

export interface NotificationCenterContextProps extends ProviderProps<INotificationCenterContext>
{

}
