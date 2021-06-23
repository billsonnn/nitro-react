import { FC, useCallback, useReducer, useState } from 'react';
import { NotificationCenterAddNotificationEvent, NotificationCenterEvent } from '../../events';
import { useUiEvent } from '../../hooks/events';
import { TransitionAnimation } from '../../layout/transitions/TransitionAnimation';
import { TransitionAnimationTypes } from '../../layout/transitions/TransitionAnimation.types';
import { NotificationCenterContextProvider } from './context/NotificationCenterContext';
import { NotificationCenterMessageHandler } from './NotificationCenterMessageHandler';
import { NotificationCenterViewProps } from './NotificationCenterView.types';
import { initialNotificationCenter, NotificationCenterActions, NotificationCenterReducer } from './reducers/NotificationCenterReducer';
import { BroadcastMessageNotification } from './utils/BroadcastMessageNotification';
import { HotelWillShutdownNotification } from './utils/HotelWillShutdownNotification';
import { ModeratorMessageNotification } from './utils/ModeratorMessageNotification';
import { MOTDNotification } from './utils/MOTDNotification';
import { NitroNotification } from './utils/Notification';
import { BroadcastMessageView } from './views/broadcast-message/BroadcastMessageView';
import { HotelWillShutdownView } from './views/hotel-will-shutdown/HotelWillShutdownView';
import { ModeratorMessageView } from './views/moderator-message/ModeratorMessageView';
import { MOTDView } from './views/motd/MOTDView';

export const NotificationCenterView: FC<NotificationCenterViewProps> = props =>
{
    const [ isVisible, setIsVisible ] = useState(false);

    const [ notificationCenterState, dispatchNotificationCenterState ] = useReducer(NotificationCenterReducer, initialNotificationCenter);
    const { notifications = null } = notificationCenterState;

    const onNotificationCenterEvent = useCallback((event: NotificationCenterEvent) =>
    {
        switch(event.type)
        {
            case NotificationCenterEvent.SHOW_NOTIFICATION_CENTER:
                setIsVisible(true);
                return;
            case NotificationCenterEvent.HIDE_NOTIFICATION_CENTER:
                setIsVisible(false);
                return;
            case NotificationCenterEvent.TOGGLE_NOTIFICATION_CENTER:
                setIsVisible(value => !value);
                return;
            case NotificationCenterEvent.ADD_NOTIFICATION: {
                const castedEvent = (event as NotificationCenterAddNotificationEvent);
                
                dispatchNotificationCenterState({
                    type: NotificationCenterActions.ADD_NOTIFICATION,
                    payload: {
                        notification: castedEvent.notification
                    }
                });
                return;
            }
        }
    }, []);

    useUiEvent(NotificationCenterEvent.SHOW_NOTIFICATION_CENTER, onNotificationCenterEvent);
    useUiEvent(NotificationCenterEvent.HIDE_NOTIFICATION_CENTER, onNotificationCenterEvent);
    useUiEvent(NotificationCenterEvent.TOGGLE_NOTIFICATION_CENTER, onNotificationCenterEvent);
    useUiEvent(NotificationCenterEvent.ADD_NOTIFICATION, onNotificationCenterEvent);

    const handleButtonClick = useCallback((action: string, value: number) =>
    {
        if(!action) return;

        switch(action)
        {
            case 'dismiss_notification':
                dispatchNotificationCenterState({
                    type: NotificationCenterActions.DISMISS_NOTIFICATION,
                    payload: {
                        id: value
                    }
                });
                return;
            case 'remove_notification':
                    dispatchNotificationCenterState({
                        type: NotificationCenterActions.REMOVE_NOTIFICATION,
                        payload: {
                            id: value
                        }
                    });
                    return;
        }
    }, [ notificationCenterState, dispatchNotificationCenterState ]);

    const mapNotifications = useCallback((notifications: NitroNotification[], inTray: boolean) =>
    {
        if(!notifications) return null;

        return notifications.map(notification =>
            {
                if(!inTray && notification.dismissed) return null;

                if(notification instanceof BroadcastMessageNotification)
                    return <BroadcastMessageView key={ notification.id } inTray={ inTray } notification={ notification as BroadcastMessageNotification } onButtonClick={ (action) => handleButtonClick(action, notification.id) } />
                if(notification instanceof MOTDNotification)
                    return <MOTDView key={ notification.id } inTray={ inTray } notification={ notification as MOTDNotification } onButtonClick={ (action) => handleButtonClick(action, notification.id) } />
                if(notification instanceof ModeratorMessageNotification)
                    return <ModeratorMessageView key={ notification.id } inTray={ inTray } notification={ notification as ModeratorMessageNotification } onButtonClick={ (action) => handleButtonClick(action, notification.id) } />
                if(notification instanceof HotelWillShutdownNotification)
                    return <HotelWillShutdownView key={ notification.id } inTray={ inTray } notification={ notification as HotelWillShutdownNotification } onButtonClick={ (action) => handleButtonClick(action, notification.id) } />
                else
                    return null;
            });
    }, [ handleButtonClick ]);

    return (
        <NotificationCenterContextProvider value={ { notificationCenterState, dispatchNotificationCenterState } }>
            <NotificationCenterMessageHandler />
            <TransitionAnimation className="nitro-notification-center-container" type={ TransitionAnimationTypes.SLIDE_RIGHT } inProp={ isVisible } timeout={ 300 }>
                <div className="nitro-notification-center pt-5 px-2">
                    { mapNotifications(notifications, true) }
                </div>
            </TransitionAnimation>
            { mapNotifications(notifications, false) }
        </NotificationCenterContextProvider>
    );
}
