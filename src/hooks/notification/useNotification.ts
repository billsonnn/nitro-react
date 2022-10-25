import { AchievementNotificationMessageEvent, ActivityPointNotificationMessageEvent, ClubGiftNotificationEvent, ClubGiftSelectedEvent, HabboBroadcastMessageEvent, HotelClosedAndOpensEvent, HotelClosesAndWillOpenAtEvent, HotelWillCloseInMinutesEvent, InfoFeedEnableMessageEvent, MaintenanceStatusMessageEvent, ModeratorCautionEvent, ModeratorMessageEvent, MOTDNotificationEvent, NotificationDialogMessageEvent, PetLevelNotificationEvent, PetReceivedMessageEvent, RespectReceivedEvent, RoomEnterEffect, RoomEnterEvent, UserBannedMessageEvent, Vector3d } from '@nitrots/nitro-renderer';
import { useCallback, useState } from 'react';
import { useBetween } from 'use-between';
import { GetConfiguration, GetNitroInstance, GetRoomEngine, GetSessionDataManager, LocalizeBadgeName, LocalizeText, NotificationAlertItem, NotificationAlertType, NotificationBubbleItem, NotificationBubbleType, NotificationConfirmItem, PlaySound, ProductImageUtility, TradingNotificationType } from '../../api';
import { useMessageEvent } from '../events';

const cleanText = (text: string) => (text && text.length) ? text.replace(/\\r/g, '\r') : '';

const getTimeZeroPadded = (time: number) =>
{
    const text = ('0' + time);

    return text.substr((text.length - 2), text.length);
}

let modDisclaimerTimeout: ReturnType<typeof setTimeout> = null;

const useNotificationState = () =>
{
    const [ alerts, setAlerts ] = useState<NotificationAlertItem[]>([]);
    const [ bubbleAlerts, setBubbleAlerts ] = useState<NotificationBubbleItem[]>([]);
    const [ confirms, setConfirms ] = useState<NotificationConfirmItem[]>([]);
    const [ bubblesDisabled, setBubblesDisabled ] = useState(false);
    const [ modDisclaimerShown, setModDisclaimerShown ] = useState(false);

    const getMainNotificationConfig = () => GetConfiguration<{ [key: string]: { delivery?: string, display?: string; title?: string; image?: string }}>('notification', {});

    const getNotificationConfig = (key: string) =>
    {
        const mainConfig = getMainNotificationConfig();

        if(!mainConfig) return null;

        return mainConfig[key];
    }

    const getNotificationPart = (options: Map<string, string>, type: string, key: string, localize: boolean) =>
    {
        if(options.has(key)) return options.get(key);

        const localizeKey = [ 'notification', type, key ].join('.');

        if(GetNitroInstance().localization.hasValue(localizeKey) || localize) return LocalizeText(localizeKey, Array.from(options.keys()), Array.from(options.values()));

        return null;
    }

    const getNotificationImageUrl = (options: Map<string, string>, type: string) =>
    {
        let imageUrl = options.get('image');

        if(!imageUrl) imageUrl = GetConfiguration<string>('image.library.notifications.url', '').replace('%image%', type.replace(/\./g, '_'));

        return LocalizeText(imageUrl);
    }

    const simpleAlert = useCallback((message: string, type: string = null, clickUrl: string = null, clickUrlText: string = null, title: string = null, imageUrl: string = null) =>
    {
        if(!title || !title.length) title = LocalizeText('notifications.broadcast.title');

        if(!type || !type.length) type = NotificationAlertType.DEFAULT;

        const alertItem = new NotificationAlertItem([ cleanText(message) ], type, clickUrl, clickUrlText, title, imageUrl);

        setAlerts(prevValue => [ alertItem, ...prevValue ]);
    }, []);

    const showNitroAlert = useCallback(() => simpleAlert(null, NotificationAlertType.NITRO), [ simpleAlert ]);

    const showSingleBubble = useCallback((message: string, type: string, imageUrl: string = null, internalLink: string = null) =>
    {
        if(bubblesDisabled) return;

        const notificationItem = new NotificationBubbleItem(message, type, imageUrl, internalLink);

        setBubbleAlerts(prevValue => [ notificationItem, ...prevValue ]);
    }, [ bubblesDisabled ]);

    const showNotification = (type: string, options: Map<string, string> = null) =>
    {
        if(!options) options = new Map();

        const configuration = getNotificationConfig(('notification.' + type));

        if(configuration) for(const key in configuration) options.set(key, configuration[key]);

        if (type === 'floorplan_editor.error') options.set('message', options.get('message').replace(/[^a-zA-Z._ ]/g, ''));

        const title = getNotificationPart(options, type, 'title', true);
        const message = getNotificationPart(options, type, 'message', true).replace(/\\r/g, '\r');
        const linkTitle = getNotificationPart(options, type, 'linkTitle', false);
        const linkUrl = getNotificationPart(options, type, 'linkUrl', false);
        const image = getNotificationImageUrl(options, type);

        if(options.get('display') === 'BUBBLE')
        {
            showSingleBubble(LocalizeText(message), NotificationBubbleType.INFO, image, linkUrl);
        }
        else
        {
            simpleAlert(LocalizeText(message), type, linkUrl, linkTitle, title, image);
        }

        if(options.get('sound')) PlaySound(options.get('sound'));
    }

    const showConfirm = useCallback((message: string, onConfirm: () => void, onCancel: () => void, confirmText: string = null, cancelText: string = null, title: string = null, type: string = null) =>
    {
        if(!confirmText || !confirmText.length) confirmText = LocalizeText('generic.confirm');

        if(!cancelText || !cancelText.length) cancelText = LocalizeText('generic.cancel');

        if(!title || !title.length) title = LocalizeText('notifications.broadcast.title');

        const confirmItem = new NotificationConfirmItem(type, message, onConfirm, onCancel, confirmText, cancelText, title);

        setConfirms(prevValue => [ confirmItem, ...prevValue ]);
    }, []);

    const showModeratorMessage = (message: string, url: string = null, showHabboWay: boolean = true) =>
    {
        simpleAlert(message, NotificationAlertType.DEFAULT, url, LocalizeText('mod.alert.link'), LocalizeText('mod.alert.title'));
    }

    const showTradeAlert = useCallback((type: number, otherUsername: string = '') =>
    {
        switch(type)
        {
            case TradingNotificationType.ALERT_SCAM:
                simpleAlert(LocalizeText('inventory.trading.warning.other_not_offering'), null, null, null, LocalizeText('inventory.trading.notification.title'));
                return;
            case TradingNotificationType.HOTEL_TRADING_DISABLED:
            case TradingNotificationType.YOU_NOT_ALLOWED:
            case TradingNotificationType.THEY_NOT_ALLOWED:
            case TradingNotificationType.ROOM_DISABLED:
            case TradingNotificationType.YOU_OPEN:
            case TradingNotificationType.THEY_OPEN:
                simpleAlert(LocalizeText(`inventory.trading.openfail.${ type }`, [ 'otherusername' ], [ otherUsername ]), null, null, null, LocalizeText('inventory.trading.openfail.title'));
                return;
            case TradingNotificationType.ERROR_WHILE_COMMIT:
                simpleAlert(`${ LocalizeText('inventory.trading.notification.caption') }, ${ LocalizeText('inventory.trading.notification.commiterror.info') }`, null, null, null, LocalizeText('inventory.trading.notification.title'));
                return;
            case TradingNotificationType.THEY_CANCELLED:
                simpleAlert(LocalizeText('inventory.trading.info.closed'), null, null, null, LocalizeText('inventory.trading.notification.title'));
                return;
        }
    }, [ simpleAlert ]);

    const closeAlert = useCallback((alert: NotificationAlertItem) =>
    {
        setAlerts(prevValue =>
        {
            const newAlerts = [ ...prevValue ];
            const index = newAlerts.findIndex(value => (alert === value));

            if(index >= 0) newAlerts.splice(index, 1);

            return newAlerts;
        });
    }, []);

    const closeBubbleAlert = useCallback((item: NotificationBubbleItem) =>
    {
        setBubbleAlerts(prevValue =>
        {
            const newAlerts = [ ...prevValue ];
            const index = newAlerts.findIndex(value => (item === value));

            if(index >= 0) newAlerts.splice(index, 1);

            return newAlerts;
        })
    }, []);

    const closeConfirm = useCallback((item: NotificationConfirmItem) =>
    {
        setConfirms(prevValue =>
        {
            const newConfirms = [ ...prevValue ];
            const index = newConfirms.findIndex(value => (item === value));

            if(index >= 0) newConfirms.splice(index, 1);

            return newConfirms;
        })
    }, []);

    useMessageEvent<RespectReceivedEvent>(RespectReceivedEvent, event =>
    {
        const parser = event.getParser();

        if(parser.userId !== GetSessionDataManager().userId) return;

        const text1 = LocalizeText('notifications.text.respect.1');
        const text2 = LocalizeText('notifications.text.respect.2', [ 'count' ], [ parser.respectsReceived.toString() ]);

        showSingleBubble(text1, NotificationBubbleType.RESPECT);
        showSingleBubble(text2, NotificationBubbleType.RESPECT);
    });

    useMessageEvent<HabboBroadcastMessageEvent>(HabboBroadcastMessageEvent, event =>
    {
        const parser = event.getParser();

        simpleAlert(parser.message.replace(/\\r/g, '\r'), null, null, LocalizeText('notifications.broadcast.title'));
    });

    useMessageEvent<AchievementNotificationMessageEvent>(AchievementNotificationMessageEvent, event =>
    {
        const parser = event.getParser();

        const text1 = LocalizeText('achievements.levelup.desc');
        const badgeName = LocalizeBadgeName(parser.data.badgeCode);
        const badgeImage = GetSessionDataManager().getBadgeUrl(parser.data.badgeCode);
        const internalLink = 'questengine/achievements/' + parser.data.category;

        showSingleBubble((text1 + ' ' + badgeName), NotificationBubbleType.ACHIEVEMENT, badgeImage, internalLink);
    });

    useMessageEvent<ClubGiftNotificationEvent>(ClubGiftNotificationEvent, event =>
    {
        const parser = event.getParser();

        if(parser.numGifts <= 0) return;

        showSingleBubble(parser.numGifts.toString(), NotificationBubbleType.CLUBGIFT, null, ('catalog/open/' + GetConfiguration('catalog.links')['hc.hc_gifts']));
    });

    useMessageEvent<ModeratorMessageEvent>(ModeratorMessageEvent, event =>
    {
        const parser = event.getParser();

        showModeratorMessage(parser.message, parser.url, false);
    });

    useMessageEvent<ActivityPointNotificationMessageEvent>(ActivityPointNotificationMessageEvent, event =>
    {
        const parser = event.getParser();

        if((parser.amountChanged <= 0) || (parser.type !== 5)) return;

        const imageUrl = GetConfiguration<string>('currency.asset.icon.url', '').replace('%type%', parser.type.toString());

        showSingleBubble(LocalizeText('notifications.text.loyalty.received', [ 'AMOUNT' ], [ parser.amountChanged.toString() ]), NotificationBubbleType.INFO, imageUrl);
    });

    useMessageEvent<UserBannedMessageEvent>(UserBannedMessageEvent, event =>
    {
        const parser = event.getParser();

        showModeratorMessage(parser.message);
    });

    useMessageEvent<HotelClosesAndWillOpenAtEvent>(HotelClosesAndWillOpenAtEvent, event =>
    {
        const parser = event.getParser();

        simpleAlert( LocalizeText(('opening.hours.' + (parser.userThrowOutAtClose ? 'disconnected' : 'closed')), [ 'h', 'm' ], [ getTimeZeroPadded(parser.openHour), getTimeZeroPadded(parser.openMinute) ]), NotificationAlertType.DEFAULT, null, null, LocalizeText('opening.hours.title'));
    });

    useMessageEvent<PetReceivedMessageEvent>(PetReceivedMessageEvent, event =>
    {
        const parser = event.getParser();

        const text = LocalizeText('notifications.text.' + (parser.boughtAsGift ? 'petbought' : 'petreceived'));

        let imageUrl: string = null;

        const imageResult = GetRoomEngine().getRoomObjectPetImage(parser.pet.typeId, parser.pet.paletteId, parseInt(parser.pet.color, 16), new Vector3d(45 * 3), 64, null, true);

        if(imageResult) imageUrl = imageResult.getImage().src;

        showSingleBubble(text, NotificationBubbleType.PETLEVEL, imageUrl);
    });

    useMessageEvent<MOTDNotificationEvent>(MOTDNotificationEvent, event =>
    {
        const parser = event.getParser();

        const messages = parser.messages.map(message => cleanText(message));

        const alertItem = new NotificationAlertItem(messages, NotificationAlertType.MOTD, null, null, LocalizeText('notifications.motd.title'));

        setAlerts(prevValue => [ alertItem, ...prevValue ]);
    });

    useMessageEvent<PetLevelNotificationEvent>(PetLevelNotificationEvent, event =>
    {
        const parser = event.getParser();

        let imageUrl: string = null;

        const imageResult = GetRoomEngine().getRoomObjectPetImage(parser.figureData.typeId, parser.figureData.paletteId, parseInt(parser.figureData.color, 16), new Vector3d(45 * 3), 64, null, true);

        if(imageResult) imageUrl = imageResult.getImage().src;

        showSingleBubble(LocalizeText('notifications.text.petlevel', [ 'pet_name', 'level' ], [ parser.petName, parser.level.toString() ]), NotificationBubbleType.PETLEVEL, imageUrl);
    });

    useMessageEvent<InfoFeedEnableMessageEvent>(InfoFeedEnableMessageEvent, event =>
    {
        const parser = event.getParser();

        setBubblesDisabled(!parser.enabled);
    });

    useMessageEvent<ClubGiftSelectedEvent>(ClubGiftSelectedEvent, event =>
    {
        const parser = event.getParser();

        if(!parser.products || !parser.products.length) return;

        const productData = parser.products[0];

        if(!productData) return;

        showSingleBubble(LocalizeText('notifications.text.club_gift.selected'), NotificationBubbleType.INFO, ProductImageUtility.getProductImageUrl(productData.productType, productData.furniClassId, productData.extraParam));
    });

    useMessageEvent<MaintenanceStatusMessageEvent>(MaintenanceStatusMessageEvent, event =>
    {
        const parser = event.getParser();

        simpleAlert(LocalizeText('maintenance.shutdown', [ 'm', 'd' ], [ parser.minutesUntilMaintenance.toString(), parser.duration.toString() ]), NotificationAlertType.DEFAULT, null, null, LocalizeText('opening.hours.title'));
    });

    useMessageEvent<ModeratorCautionEvent>(ModeratorCautionEvent, event =>
    {
        const parser = event.getParser();

        showModeratorMessage(parser.message, parser.url);
    });

    useMessageEvent<NotificationDialogMessageEvent>(NotificationDialogMessageEvent, event =>
    {
        const parser = event.getParser();

        showNotification(parser.type, parser.parameters);
    });

    useMessageEvent<HotelWillCloseInMinutesEvent>(HotelWillCloseInMinutesEvent, event =>
    {
        const parser = event.getParser();

        simpleAlert(LocalizeText('opening.hours.shutdown', [ 'm' ], [ parser.openMinute.toString() ]), NotificationAlertType.DEFAULT, null, null, LocalizeText('opening.hours.title'));
    });

    useMessageEvent<HotelClosedAndOpensEvent>(HotelClosedAndOpensEvent, event =>
    {
        const parser = event.getParser();

        simpleAlert(LocalizeText('opening.hours.disconnected', [ 'h', 'm' ], [ parser.openHour.toString(), parser.openMinute.toString() ]), NotificationAlertType.DEFAULT, null, null, LocalizeText('opening.hours.title'));
    });

    const onRoomEnterEvent = useCallback(() =>
    {
        if(modDisclaimerShown) return;

        if(RoomEnterEffect.isRunning())
        {
            if(modDisclaimerTimeout) return;

            modDisclaimerTimeout = setTimeout(() =>
            {
                onRoomEnterEvent();
            }, (RoomEnterEffect.totalRunningTime + 5000));
        }
        else
        {
            if(modDisclaimerTimeout)
            {
                clearTimeout(modDisclaimerTimeout);

                modDisclaimerTimeout = null;
            }

            showSingleBubble(LocalizeText('mod.chatdisclaimer'), NotificationBubbleType.INFO);

            setModDisclaimerShown(true);
        }
    }, [ modDisclaimerShown, showSingleBubble ]);

    useMessageEvent<RoomEnterEvent>(RoomEnterEvent, onRoomEnterEvent);

    return { alerts, bubbleAlerts, confirms, simpleAlert, showNitroAlert, showTradeAlert, showConfirm, closeAlert, closeBubbleAlert, closeConfirm };
}

export const useNotification = () => useBetween(useNotificationState);
