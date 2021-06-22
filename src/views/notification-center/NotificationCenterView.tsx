import { FC, useCallback, useState } from 'react';
import { NotificationCenterEvent } from '../../events';
import { useUiEvent } from '../../hooks/events';
import { TransitionAnimation } from '../../layout/transitions/TransitionAnimation';
import { TransitionAnimationTypes } from '../../layout/transitions/TransitionAnimation.types';
import { NotificationCenterViewProps } from './NotificationCenterView.types';

export const NotificationCenterView: FC<NotificationCenterViewProps> = props =>
{
    const [ isVisible, setIsVisible ] = useState(false);

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
        }
    }, []);

    useUiEvent(NotificationCenterEvent.SHOW_NOTIFICATION_CENTER, onNotificationCenterEvent);
    useUiEvent(NotificationCenterEvent.HIDE_NOTIFICATION_CENTER, onNotificationCenterEvent);
    useUiEvent(NotificationCenterEvent.TOGGLE_NOTIFICATION_CENTER, onNotificationCenterEvent);


    return (
        <TransitionAnimation className="nitro-notification-center-container" type={ TransitionAnimationTypes.SLIDE_RIGHT } inProp={ isVisible } timeout={ 300 }>
            <div className="nitro-notification-center">
                test
            </div>
        </TransitionAnimation>
    );
}
