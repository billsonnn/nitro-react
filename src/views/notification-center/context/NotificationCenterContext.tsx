import { createContext, FC, useContext } from 'react';
import { INotificationCenterContext, NotificationCenterContextProps } from './NotificationCenterContext.types';

const NotificationCenterContext = createContext<INotificationCenterContext>({
    notificationCenterState: null,
    dispatchNotificationCenterState: null
});

export const NotificationCenterContextProvider: FC<NotificationCenterContextProps> = props =>
{
    return <NotificationCenterContext.Provider value={ props.value }>{ props.children }</NotificationCenterContext.Provider>
}

export const useNotificationCenterContext = () => useContext(NotificationCenterContext);
