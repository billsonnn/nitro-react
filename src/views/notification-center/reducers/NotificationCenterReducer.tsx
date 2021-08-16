import { Reducer } from 'react';
import { NitroNotification } from '../common/Notification';

export interface INotificationCenterState
{
    notifications: NitroNotification[];
}

export interface INotificationCenterAction
{
    type: string;
    payload: {
        id?: number;
        notification?: NitroNotification;
    };
}

export class NotificationCenterActions
{
    public static ADD_NOTIFICATION: string = 'NCA_ADD_NOTIFICATION';
    public static REMOVE_NOTIFICATION: string = 'NCA_REMOVE_NOTIFICATION';
    public static DISMISS_NOTIFICATION: string = 'NCA_DISMISS_NOTIFICATION';
}

export const initialNotificationCenter: INotificationCenterState = {
    notifications: []
}

export const NotificationCenterReducer: Reducer<INotificationCenterState, INotificationCenterAction> = (state, action) =>
{
    switch(action.type)
    {   
        case NotificationCenterActions.ADD_NOTIFICATION: {
            const notification = (action.payload.notification || null);

            if(!notification) return state;

            const notifications = [ ...state.notifications, notification ];

            return { ...state, notifications };
        }
        case NotificationCenterActions.REMOVE_NOTIFICATION: {
            const id = (action.payload.id || null);

            if(!id) return state;

            if(!state.notifications) return state;

            const notifications = Array.from(state.notifications);
            const notificationIndex = notifications.findIndex(notification => notification.id === id);

            if(notificationIndex === -1) return state;

            notifications.splice(notificationIndex, 1);

            return { ...state, notifications };
        }
        case NotificationCenterActions.DISMISS_NOTIFICATION: {
            const id = (action.payload.id || null);

            if(!id) return state;

            if(!state.notifications) return state;

            const notifications = Array.from(state.notifications);
            const notificationIndex = notifications.findIndex(notification => notification.id === id);

            if(notificationIndex === -1) return state;

            notifications[notificationIndex].dismiss();

            return { ...state, notifications };
        }
        default:
            return state;
    }
}
