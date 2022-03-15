import { AchievementNotificationMessageEvent, ActivityPointNotificationMessageEvent, ClubGiftNotificationEvent, ClubGiftSelectedEvent, HabboBroadcastMessageEvent, HotelClosedAndOpensEvent, HotelClosesAndWillOpenAtEvent, HotelWillCloseInMinutesEvent, InfoFeedEnableMessageEvent, MaintenanceStatusMessageEvent, ModeratorCautionEvent, ModeratorMessageEvent, MOTDNotificationEvent, NotificationDialogMessageEvent, PetLevelNotificationEvent, PetReceivedMessageEvent, RespectReceivedEvent, RoomEnterEvent, UserBannedMessageEvent, Vector3d } from '@nitrots/nitro-renderer';
import { FC, useCallback } from 'react';
import { GetConfiguration, GetRoomEngine, GetSessionDataManager, LocalizeBadgeName, LocalizeText, NotificationBubbleType, NotificationUtilities, ProductImageUtility } from '../../api';
import { UseMessageEventHook } from '../../hooks';

export const NotificationCenterMessageHandler: FC<{}> = props =>
{
    const onRespectReceivedEvent = useCallback((event: RespectReceivedEvent) =>
    {
        const parser = event.getParser();

        if(parser.userId !== GetSessionDataManager().userId) return;

        const text1 = LocalizeText('notifications.text.respect.1');
        const text2 = LocalizeText('notifications.text.respect.2', [ 'count' ], [ parser.respectsReceived.toString() ]);

        NotificationUtilities.showSingleBubble(text1, NotificationBubbleType.RESPECT);
        NotificationUtilities.showSingleBubble(text2, NotificationBubbleType.RESPECT);
    }, []);

    UseMessageEventHook(RespectReceivedEvent, onRespectReceivedEvent);

    const onHabboBroadcastMessageEvent = useCallback((event: HabboBroadcastMessageEvent) =>
    {
        const parser = event.getParser();

        NotificationUtilities.simpleAlert(parser.message.replace(/\\r/g, '\r'), null, null, LocalizeText('notifications.broadcast.title'));
    }, []);

    UseMessageEventHook(HabboBroadcastMessageEvent, onHabboBroadcastMessageEvent);

    const onAchievementNotificationMessageEvent = useCallback((event: AchievementNotificationMessageEvent) =>
    {
        const parser = event.getParser();

        const text1 = LocalizeText('achievements.levelup.desc');
        const badgeName = LocalizeBadgeName(parser.data.badgeCode);
        const badgeImage = GetSessionDataManager().getBadgeUrl(parser.data.badgeCode);
        const internalLink = 'questengine/achievements/' + parser.data.category;

        NotificationUtilities.showSingleBubble((text1 + ' ' + badgeName), NotificationBubbleType.ACHIEVEMENT, badgeImage, internalLink);
    }, []);

    UseMessageEventHook(AchievementNotificationMessageEvent, onAchievementNotificationMessageEvent);

    const onClubGiftNotificationEvent = useCallback((event: ClubGiftNotificationEvent) =>
    {
        const parser = event.getParser();

        NotificationUtilities.showClubGiftNotification(parser.numGifts);
    }, []);

    UseMessageEventHook(ClubGiftNotificationEvent, onClubGiftNotificationEvent);

    const onModeratorMessageEvent = useCallback((event: ModeratorMessageEvent) =>
    {
        const parser = event.getParser();

        NotificationUtilities.handleModeratorMessage(parser.message, parser.url);
    }, []);

    UseMessageEventHook(ModeratorMessageEvent, onModeratorMessageEvent);

    const onActivityPointNotificationMessageEvent = useCallback((event: ActivityPointNotificationMessageEvent) =>
    {
        const parser = event.getParser();

        if((parser.amountChanged <= 0) || (parser.type !== 5)) return;

        const imageUrl = GetConfiguration<string>('currency.asset.icon.url', '').replace('%type%', parser.type.toString());

        NotificationUtilities.showSingleBubble(LocalizeText('notifications.text.loyalty.received', [ 'amount' ], [ parser.amountChanged.toString() ]), NotificationBubbleType.INFO, imageUrl);
    }, []);

    UseMessageEventHook(ActivityPointNotificationMessageEvent, onActivityPointNotificationMessageEvent);

    const onUserBannedMessageEvent = useCallback((event: UserBannedMessageEvent) =>
    {
        const parser = event.getParser();

        NotificationUtilities.handleUserBannedMessage(parser.message);
    }, []);

    UseMessageEventHook(UserBannedMessageEvent, onUserBannedMessageEvent);

    const onHotelClosesAndWillOpenAtEvent = useCallback((event: HotelClosesAndWillOpenAtEvent) =>
    {
        const parser = event.getParser();

        NotificationUtilities.handleHotelClosedMessage(parser.openHour, parser.openMinute, parser.userThrowOutAtClose);
    }, []);

    UseMessageEventHook(HotelClosesAndWillOpenAtEvent, onHotelClosesAndWillOpenAtEvent);

    const onPetReceivedMessageEvent = useCallback((event: PetReceivedMessageEvent) =>
    {
        const parser = event.getParser();

        const text = LocalizeText('notifications.text.' + (parser.boughtAsGift ? 'petbought' : 'petreceived'));

        let imageUrl: string = null;

        const imageResult = GetRoomEngine().getRoomObjectPetImage(parser.pet.typeId, parser.pet.paletteId, parseInt(parser.pet.color, 16), new Vector3d(45 * 3), 64, null, true);

        if(imageResult) imageUrl = imageResult.getImage().src;

        NotificationUtilities.showSingleBubble(text, NotificationBubbleType.PETLEVEL, imageUrl);
    }, []);

    UseMessageEventHook(PetReceivedMessageEvent, onPetReceivedMessageEvent);

    const onRoomEnterEvent = useCallback((event: RoomEnterEvent) =>
    {
        const parser = event.getParser();

        NotificationUtilities.showModerationDisclaimer();
    }, []);

    UseMessageEventHook(RoomEnterEvent, onRoomEnterEvent);

    const onMOTDNotificationEvent = useCallback((event: MOTDNotificationEvent) =>
    {
        const parser = event.getParser();

        NotificationUtilities.handleMOTD(parser.messages);
    }, []);

    UseMessageEventHook(MOTDNotificationEvent, onMOTDNotificationEvent);

    const onPetLevelNotificationEvent = useCallback((event: PetLevelNotificationEvent) =>
    {
        const parser = event.getParser();

        let imageUrl: string = null;

        const imageResult = GetRoomEngine().getRoomObjectPetImage(parser.figureData.typeId, parser.figureData.paletteId, parseInt(parser.figureData.color, 16), new Vector3d(45 * 3), 64, null, true);

        if(imageResult) imageUrl = imageResult.getImage().src;

        NotificationUtilities.showSingleBubble(LocalizeText('notifications.text.petlevel', [ 'pet_name', 'level' ], [ parser.petName, parser.level.toString() ]), NotificationBubbleType.PETLEVEL, imageUrl);
    }, []);

    UseMessageEventHook(PetLevelNotificationEvent, onPetLevelNotificationEvent);

    const onInfoFeedEnableMessageEvent = useCallback((event: InfoFeedEnableMessageEvent) =>
    {
        const parser = event.getParser();

        NotificationUtilities.BUBBLES_DISABLED = !(parser.enabled);
    }, []);

    UseMessageEventHook(InfoFeedEnableMessageEvent, onInfoFeedEnableMessageEvent);

    const onClubGiftSelectedEvent = useCallback((event: ClubGiftSelectedEvent) =>
    {
        const parser = event.getParser();

        if(!parser.products || !parser.products.length) return;

        const productData = parser.products[0];

        if(!productData) return;

        NotificationUtilities.showSingleBubble(LocalizeText('notifications.text.club_gift.selected'), NotificationBubbleType.INFO, ProductImageUtility.getProductImageUrl(productData.productType, productData.furniClassId, productData.extraParam))
    }, []);

    UseMessageEventHook(ClubGiftSelectedEvent, onClubGiftSelectedEvent);

    const onMaintenanceStatusMessageEvent = useCallback((event: MaintenanceStatusMessageEvent) =>
    {
        const parser = event.getParser();

        NotificationUtilities.handleHotelMaintenanceMessage(parser.minutesUntilMaintenance, parser.duration);
    }, []);

    UseMessageEventHook(MaintenanceStatusMessageEvent, onMaintenanceStatusMessageEvent);

    const onModeratorCautionEvent = useCallback((event: ModeratorCautionEvent) =>
    {
        const parser = event.getParser();

        NotificationUtilities.handleModeratorCaution(parser.message, parser.url);
    }, []);

    UseMessageEventHook(ModeratorCautionEvent, onModeratorCautionEvent);

    const onNotificationDialogMessageEvent = useCallback((event: NotificationDialogMessageEvent) =>
    {
        const parser = event.getParser();

        NotificationUtilities.showNotification(parser.type, parser.parameters);
    }, []);

    UseMessageEventHook(NotificationDialogMessageEvent, onNotificationDialogMessageEvent);

    const onHotelWillCloseInMinutesEvent = useCallback((event: HotelWillCloseInMinutesEvent) =>
    {
        const parser = event.getParser();

        NotificationUtilities.handleHotelClosingMessage(parser.openMinute);
    }, []);

    UseMessageEventHook(HotelWillCloseInMinutesEvent, onHotelWillCloseInMinutesEvent);

    const onHotelClosedAndOpensEvent = useCallback((event: HotelClosedAndOpensEvent) =>
    {
        const parser = event.getParser();

        NotificationUtilities.handleLoginFailedHotelClosedMessage(parser.openHour, parser.openMinute);
    }, []);

    UseMessageEventHook(HotelClosedAndOpensEvent, onHotelClosedAndOpensEvent);

    return null;
}
