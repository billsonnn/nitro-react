import { HabboBroadcastMessageEvent, HotelWillShutdownEvent, ModeratorMessageEvent, MOTDNotificationEvent, NotificationDialogMessageEvent } from 'nitro-renderer';
import { FC, useCallback } from 'react';
import { NotificationCenterAlertEvent } from '../../events';
import { dispatchUiEvent } from '../../hooks/events';
import { CreateMessageHook } from '../../hooks/messages';
import { DialogMessageNotification } from './common/DialogMessageNotification';
import { HotelWillShutdownNotification } from './common/HotelWillShutdownNotification';
import { useNotificationCenterContext } from './context/NotificationCenterContext';
import { INotificationCenterMessageHandlerProps } from './NotificationCenterMessageHandler.types';
import { NotificationCenterActions } from './reducers/NotificationCenterReducer';

export const NotificationCenterMessageHandler: FC<INotificationCenterMessageHandlerProps> = props =>
{
    const { dispatchNotificationCenterState = null } = useNotificationCenterContext();

    const onHabboBroadcastMessageEvent = useCallback((event: HabboBroadcastMessageEvent) =>
    {
        const parser = event.getParser();

        dispatchUiEvent(new NotificationCenterAlertEvent(NotificationCenterAlertEvent.HOTEL_ALERT, [ parser.message ]));
    }, []);

    const onModeratorMessageEvent = useCallback((event: ModeratorMessageEvent) =>
    {
        const parser = event.getParser();

        dispatchUiEvent(new NotificationCenterAlertEvent(NotificationCenterAlertEvent.HOTEL_ALERT, [ parser.message ], parser.link));
    }, []);

    const onMOTDNotificationEvent = useCallback((event: MOTDNotificationEvent) =>
    {
        const parser = event.getParser();

        dispatchUiEvent(new NotificationCenterAlertEvent(NotificationCenterAlertEvent.HOTEL_ALERT, parser.messages));
    }, []);

    const onHotelWillShutdownEvent = useCallback((event: HotelWillShutdownEvent) =>
    {
        const parser = event.getParser();

        dispatchNotificationCenterState({
            type: NotificationCenterActions.ADD_NOTIFICATION,
            payload: {
                notification: new HotelWillShutdownNotification(parser.minutes)
            }
        });
    }, [ dispatchNotificationCenterState ]);

    const onNotificationDialogMessageEvent = useCallback((event: NotificationDialogMessageEvent) =>
    {
        const parser = event.getParser();

        console.log(parser);

        dispatchNotificationCenterState({
            type: NotificationCenterActions.ADD_NOTIFICATION,
            payload: {
                notification: new DialogMessageNotification(parser.type, parser.parameters)
            }
        });
    }, [ dispatchNotificationCenterState ]);

    CreateMessageHook(HabboBroadcastMessageEvent, onHabboBroadcastMessageEvent);
    CreateMessageHook(ModeratorMessageEvent, onModeratorMessageEvent);
    CreateMessageHook(MOTDNotificationEvent, onMOTDNotificationEvent);
    CreateMessageHook(HotelWillShutdownEvent, onHotelWillShutdownEvent);
    CreateMessageHook(NotificationDialogMessageEvent, onNotificationDialogMessageEvent);

    return null;
}
