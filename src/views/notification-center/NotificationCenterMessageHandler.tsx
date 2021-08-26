import { AchievementNotificationMessageEvent, ActivityPointNotificationMessageEvent, ClubGiftNotificationEvent, HabboBroadcastMessageEvent, HotelClosesAndWillOpenAtEvent, HotelWillShutdownEvent, ModeratorMessageEvent, MOTDNotificationEvent, NotificationDialogMessageEvent, PetAddedToInventoryEvent, RespectReceivedEvent, Vector3d } from '@nitrots/nitro-renderer';
import { FC, useCallback } from 'react';
import { GetRoomEngine, GetSessionDataManager, LocalizeBadgeName, LocalizeText } from '../../api';
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

    const onRespectReceivedEvent = useCallback((event: RespectReceivedEvent) =>
    {
        const parser = event.getParser();

        if(parser.userId !== GetSessionDataManager().userId) return;

        const text1 = LocalizeText('notifications.text.respect.1');
        const text2 = LocalizeText('notifications.text.respect.2', [ 'count' ], [ parser.respectsReceived.toString() ]);

        NotificationUtilities.showSingleBubble(text1, NotificationType.RESPECT);
        NotificationUtilities.showSingleBubble(text2, NotificationType.RESPECT);
    }, []);

    CreateMessageHook(RespectReceivedEvent, onRespectReceivedEvent);

    const onHabboBroadcastMessageEvent = useCallback((event: HabboBroadcastMessageEvent) =>
    {
        const parser = event.getParser();

        NotificationUtilities.simpleAlert(parser.message.replace(/\\r/g, '\r'));
    }, []);

    CreateMessageHook(HabboBroadcastMessageEvent, onHabboBroadcastMessageEvent);

    const onAchievementNotificationMessageEvent = useCallback((event: AchievementNotificationMessageEvent) =>
    {
        const parser = event.getParser();

        const text1 = LocalizeText('achievements.levelup.desc');
        const badgeName = LocalizeBadgeName(parser.data.badgeCode);
        const badgeImage = GetSessionDataManager().getBadgeUrl(parser.data.badgeCode);
        const internalLink = 'questengine/achievements/' + parser.data.category;

        NotificationUtilities.showSingleBubble((text1 + ' ' + badgeName), NotificationType.ACHIEVEMENT, badgeImage, internalLink);
    }, []);

    CreateMessageHook(AchievementNotificationMessageEvent, onAchievementNotificationMessageEvent);

    const onClubGiftNotificationEvent = useCallback((event: ClubGiftNotificationEvent) =>
    {
        const parser = event.getParser();

        NotificationUtilities.showClubGiftNotification(parser.numGifts);
    }, []);

    CreateMessageHook(ClubGiftNotificationEvent, onClubGiftNotificationEvent);

    const onModeratorMessageEvent = useCallback((event: ModeratorMessageEvent) =>
    {
        const parser = event.getParser();

        dispatchUiEvent(new NotificationCenterAlertEvent(NotificationCenterAlertEvent.HOTEL_ALERT, [ parser.message ], parser.link));
    }, []);

    CreateMessageHook(ModeratorMessageEvent, onModeratorMessageEvent);

    const onActivityPointNotificationMessageEvent = useCallback((event: ActivityPointNotificationMessageEvent) =>
    {
        const parser = event.getParser();

        // bubble for loyalty
    }, []);

    CreateMessageHook(ActivityPointNotificationMessageEvent, onActivityPointNotificationMessageEvent);

    const onHotelClosesAndWillOpenAtEvent = useCallback((event: HotelClosesAndWillOpenAtEvent) =>
    {
        const parser = event.getParser();

        NotificationUtilities.handleHotelClosedMessage(parser.openHour, parser.openMinute, parser.userThrowOutAtClose);
    }, []);

    CreateMessageHook(HotelClosesAndWillOpenAtEvent, onHotelClosesAndWillOpenAtEvent);

    const onPetAddedToInventoryEvent = useCallback((event: PetAddedToInventoryEvent) =>
    {
        const parser = event.getParser();

        const text = LocalizeText('notifications.text.' + (parser.boughtAsGift ? 'petbought' : 'petreceived'));

        let imageUrl: string = null;

        const imageResult = GetRoomEngine().getRoomObjectPetImage(parser.pet.typeId, parser.pet.paletteId, parseInt(parser.pet.color, 16), new Vector3d(45 * 3), 64, null, true);

        if(imageResult) imageUrl = imageResult.getImage().src;

        NotificationUtilities.showSingleBubble(text, NotificationType.PETLEVEL, imageUrl);
    }, []);

    CreateMessageHook(PetAddedToInventoryEvent, onPetAddedToInventoryEvent);

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

    CreateMessageHook(MOTDNotificationEvent, onMOTDNotificationEvent);
    CreateMessageHook(HotelWillShutdownEvent, onHotelWillShutdownEvent);
    CreateMessageHook(NotificationDialogMessageEvent, onNotificationDialogMessageEvent);

    return null;
}
