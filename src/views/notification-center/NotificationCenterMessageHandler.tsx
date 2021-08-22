import { AchievementNotificationMessageEvent, HabboBroadcastMessageEvent, HotelWillShutdownEvent, ModeratorMessageEvent, MOTDNotificationEvent, NotificationDialogMessageEvent, RespectReceivedEvent } from '@nitrots/nitro-renderer';
import { FC, useCallback } from 'react';
import { GetSessionDataManager, LocalizeBadgeName, LocalizeText } from '../../api';
import { NotificationCenterAlertEvent } from '../../events';
import { dispatchUiEvent } from '../../hooks/events';
import { CreateMessageHook } from '../../hooks/messages';
import { HotelWillShutdownNotification } from './common/HotelWillShutdownNotification';
import { NotificationType } from './common/NotificationType';
import { NotificationUtilities } from './common/NotificationUtilities';
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

        NotificationUtilities.showNotification(parser.type, parser.parameters);
    }, []);

    const onRespectReceivedEvent = useCallback((event: RespectReceivedEvent) =>
    {
        const parser = event.getParser();

        if(parser.userId !== GetSessionDataManager().userId) return;

        const text1 = LocalizeText('notifications.text.respect.1');
        const text2 = LocalizeText('notifications.text.respect.2', [ 'count' ], [ parser.respectsReceived.toString() ]);

        NotificationUtilities.showSingleBubble(text1, NotificationType.RESPECT);
        NotificationUtilities.showSingleBubble(text2, NotificationType.RESPECT);
    }, []);

    const onAchievementNotificationMessageEvent = useCallback((event: AchievementNotificationMessageEvent) =>
    {
        const parser = event.getParser();

        const text1 = LocalizeText('achievements.levelup.desc');
        const badgeName = LocalizeBadgeName(parser.data.badgeCode);
        const badgeImage = GetSessionDataManager().getBadgeUrl(parser.data.badgeCode);
        const internalLink = 'questengine/achievements/' + parser.data.category;

        NotificationUtilities.showSingleBubble((text1 + ' ' + badgeName), NotificationType.ACHIEVEMENT, badgeImage, internalLink);
    }, []);

    CreateMessageHook(HabboBroadcastMessageEvent, onHabboBroadcastMessageEvent);
    CreateMessageHook(ModeratorMessageEvent, onModeratorMessageEvent);
    CreateMessageHook(MOTDNotificationEvent, onMOTDNotificationEvent);
    CreateMessageHook(HotelWillShutdownEvent, onHotelWillShutdownEvent);
    CreateMessageHook(NotificationDialogMessageEvent, onNotificationDialogMessageEvent);
    CreateMessageHook(RespectReceivedEvent, onRespectReceivedEvent);
    CreateMessageHook(AchievementNotificationMessageEvent, onAchievementNotificationMessageEvent);

    return null;
}
