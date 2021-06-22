import { HabboBroadcastMessageEvent, HotelWillShutdownEvent, ModeratorMessageEvent, MOTDNotificationEvent, NotificationDialogMessageEvent } from 'nitro-renderer';
import { FC, useCallback } from 'react';
import { CreateMessageHook } from '../../hooks/messages';
import { useNotificationCenterContext } from './context/NotificationCenterContext';
import { INotificationCenterMessageHandlerProps } from './NotificationCenterMessageHandler.types';
import { NotificationCenterActions } from './reducers/NotificationCenterReducer';
import { BroadcastMessageNotification } from './utils/BroadcastMessageNotification';
import { DialogMessageNotification } from './utils/DialogMessageNotification';
import { HotelWillShutdownNotification } from './utils/HotelWillShutdownNotification';
import { ModeratorMessageNotification } from './utils/ModeratorMessageNotification';
import { MOTDNotification } from './utils/MOTDNotification';

export const NotificationCenterMessageHandler: FC<INotificationCenterMessageHandlerProps> = props =>
{
    const { dispatchNotificationCenterState = null } = useNotificationCenterContext();

    const onHabboBroadcastMessageEvent = useCallback((event: HabboBroadcastMessageEvent) =>
    {
        const parser = event.getParser();

        dispatchNotificationCenterState({
            type: NotificationCenterActions.ADD_NOTIFICATION,
            payload: {
                notification: new BroadcastMessageNotification(parser.message)
            }
        });
    }, [ dispatchNotificationCenterState ]);

    const onNotificationDialogMessageEvent = useCallback((event: NotificationDialogMessageEvent) =>
    {
        const parser = event.getParser();

        dispatchNotificationCenterState({
            type: NotificationCenterActions.ADD_NOTIFICATION,
            payload: {
                notification: new DialogMessageNotification(parser.type, parser.parameters)
            }
        });
    }, [ dispatchNotificationCenterState ]);

    const onModeratorMessageEvent = useCallback((event: ModeratorMessageEvent) =>
    {
        const parser = event.getParser();

        dispatchNotificationCenterState({
            type: NotificationCenterActions.ADD_NOTIFICATION,
            payload: {
                notification: new ModeratorMessageNotification(parser.message, parser.link)
            }
        });
    }, [ dispatchNotificationCenterState ]);

    const onMOTDNotificationEvent = useCallback((event: MOTDNotificationEvent) =>
    {
        const parser = event.getParser();

        dispatchNotificationCenterState({
            type: NotificationCenterActions.ADD_NOTIFICATION,
            payload: {
                notification: new MOTDNotification(parser.messages)
            }
        });
    }, [ dispatchNotificationCenterState ]);

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

    CreateMessageHook(HabboBroadcastMessageEvent, onHabboBroadcastMessageEvent);
    CreateMessageHook(NotificationDialogMessageEvent, onNotificationDialogMessageEvent);
    CreateMessageHook(ModeratorMessageEvent, onModeratorMessageEvent);
    CreateMessageHook(MOTDNotificationEvent, onMOTDNotificationEvent);
    CreateMessageHook(HotelWillShutdownEvent, onHotelWillShutdownEvent);

    return null;
}
