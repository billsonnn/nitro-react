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
import { ModeratorMessageNotification } from './utils/ModeratorMessageNotification';
import { MOTDNotification } from './utils/MOTDNotification';
import { BroadcastMessageView } from './views/broadcast-message/BroadcastMessageView';
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
            case 'dismiss_alert':
                dispatchNotificationCenterState({
                    type: NotificationCenterActions.REMOVE_NOTIFICATION,
                    payload: {
                        id: value
                    }
                });
                return;
        }
    }, []);

    return (
        <NotificationCenterContextProvider value={ { notificationCenterState, dispatchNotificationCenterState } }>
            <NotificationCenterMessageHandler />
            <TransitionAnimation className="nitro-notification-center-container" type={ TransitionAnimationTypes.SLIDE_RIGHT } inProp={ isVisible } timeout={ 300 }>
                <div className="nitro-notification-center">
                    
                </div>
            </TransitionAnimation>
            { notifications && notifications.map(notification =>
                {
                    if(notification instanceof BroadcastMessageNotification)
                        return <BroadcastMessageView key={ notification.id } notification={ notification as BroadcastMessageNotification } onCloseClick={ () => handleButtonClick('dismiss_alert', notification.id) } />
                    if(notification instanceof MOTDNotification)
                        return <MOTDView key={ notification.id } notification={ notification as MOTDNotification } onCloseClick={ () => handleButtonClick('dismiss_alert', notification.id) } />
                    if(notification instanceof ModeratorMessageNotification)
                    return <ModeratorMessageView key={ notification.id } notification={ notification as ModeratorMessageNotification } onCloseClick={ () => handleButtonClick('dismiss_alert', notification.id) } />
                    else
                        return null;
                    
                }) }
        </NotificationCenterContextProvider>
    );
}
