import { HabboWebTools, RoomEnterEffect } from '@nitrots/nitro-renderer';
import { CreateLinkEvent, GetConfiguration, GetNitroInstance, LocalizeText, PlaySound } from '..';
import { NotificationAlertEvent, NotificationConfirmEvent } from '../../events';
import { NotificationBubbleEvent } from '../../events/notification-center/NotificationBubbleEvent';
import { DispatchUiEvent } from '../../hooks';
import { NotificationAlertType } from './NotificationAlertType';
import { NotificationBubbleType } from './NotificationBubbleType';

export class NotificationUtilities
{
    private static MODERATION_DISCLAIMER_SHOWN: boolean = false;
    private static MODERATION_DISCLAIMER_DELAY_MS: number = 5000;
    private static MODERATION_DISCLAIMER_TIMEOUT: ReturnType<typeof setTimeout> = null;

    public static BUBBLES_DISABLED: boolean = false;

    private static cleanText(text: string): string
    {
        return text.replace(/\\r/g, '\r')
    }

    private static getTimeZeroPadded(time: number): string
    {
        const text = ('0' + time);

        return text.substr((text.length - 2), text.length);
    }

    private static getMainNotificationConfig(): { [key: string]: { delivery?: string, display?: string; title?: string; image?: string }}
    {
        return GetConfiguration<{ [key: string]: { delivery?: string, display?: string; title?: string; image?: string }}>('notification', {});
    }

    private static getNotificationConfig(key: string): { delivery?: string, display?: string; title?: string; image?: string }
    {
        const mainConfig = this.getMainNotificationConfig();

        if(!mainConfig) return null;

        return mainConfig[key];
    }

    public static getNotificationPart(options: Map<string, string>, type: string, key: string, localize: boolean): string
    {
        if(options.has(key)) return options.get(key);

        const localizeKey = [ 'notification', type, key ].join('.');

        if(GetNitroInstance().localization.hasValue(localizeKey) || localize)
        {
            return LocalizeText(localizeKey, Array.from(options.keys()), Array.from(options.values()));
        }

        return null;
    }

    public static getNotificationImageUrl(options: Map<string, string>, type: string): string
    {
        let imageUrl = options.get('image');

        if(!imageUrl) imageUrl = GetConfiguration<string>('image.library.notifications.url', '').replace('%image%', type.replace(/\./g, '_'));

        return LocalizeText(imageUrl);
    }

    public static showNotification(type: string, options: Map<string, string> = null): void
    {
        if(!options) options = new Map();

        const configuration = this.getNotificationConfig(('notification.' + type));

        if(configuration) for(const key in configuration) options.set(key, configuration[key]);

        const title = this.getNotificationPart(options, type, 'title', true);
        const message = this.getNotificationPart(options, type, 'message', true).replace(/\\r/g, '\r');
        const linkTitle = this.getNotificationPart(options, type, 'linkTitle', false);
        const linkUrl = this.getNotificationPart(options, type, 'linkUrl', false);
        const image = this.getNotificationImageUrl(options, type);
        
        if(options.get('display') === 'BUBBLE')
        {
            this.showSingleBubble(LocalizeText(message), NotificationBubbleType.INFO, image, linkUrl);
        }
        else
        {
            this.simpleAlert(message, type, linkUrl, linkTitle, title, image);
        }

        if(options.get('sound')) PlaySound(options.get('sound'));
    }

    public static showSingleBubble(message: string, type: string, imageUrl: string = null, internalLink: string = null): void
    {
        if(this.BUBBLES_DISABLED) return;

        DispatchUiEvent(new NotificationBubbleEvent(message, type, imageUrl, internalLink));
    }

    public static showClubGiftNotification(numGifts: number): void
    {
        if(numGifts <= 0) return;

        this.showSingleBubble(numGifts.toString(), NotificationBubbleType.CLUBGIFT, null, ('catalog/open/' + GetConfiguration('catalog.links')['hc.hc_gifts']));
    }

    public static handleMOTD(messages: string[]): void
    {
        messages = messages.map(message => this.cleanText(message));

        DispatchUiEvent(new NotificationAlertEvent(messages, NotificationAlertType.MOTD, null, null, LocalizeText('notifications.motd.title')));
    }

    public static confirm(message: string, onConfirm: Function, onCancel: Function, confirmText: string = null, cancelText: string = null, title: string = null, type: string = null): void
    {
        if(!confirmText || !confirmText.length) confirmText = LocalizeText('generic.confirm');

        if(!cancelText || !cancelText.length) cancelText = LocalizeText('generic.cancel');

        if(!title || !title.length) title = LocalizeText('notifications.broadcast.title');

        DispatchUiEvent(new NotificationConfirmEvent(type, this.cleanText(message), onConfirm, onCancel, confirmText, cancelText, title));
    }

    public static simpleAlert(message: string, type: string = null, clickUrl: string = null, clickUrlText: string = null, title: string = null, imageUrl: string = null): void
    {
        if(!title || !title.length) title = LocalizeText('notifications.broadcast.title');

        if(!type || !type.length) type = NotificationAlertType.DEFAULT;

        DispatchUiEvent(new NotificationAlertEvent([ this.cleanText(message) ], type, clickUrl, clickUrlText, title, imageUrl));
    }

    public static showNitroAlert(): void
    {
        DispatchUiEvent(new NotificationAlertEvent(null, NotificationAlertType.NITRO));
    }

    public static showModeratorMessage(message: string, url: string = null, showHabboWay: boolean = true): void
    {
        this.simpleAlert(message, NotificationAlertType.DEFAULT, url, LocalizeText('mod.alert.link'), LocalizeText('mod.alert.title'));
    }

    public static handleModeratorCaution(message: string, url: string = null): void
    {
        this.showModeratorMessage(message, url);
    }

    public static handleModeratorMessage(message: string, url: string = null): void
    {
        this.showModeratorMessage(message, url, false);
    }

    public static handleUserBannedMessage(message: string): void
    {
        this.showModeratorMessage(message);
    }

    public static handleHotelClosedMessage(open: number, minute: number, thrownOut: boolean): void
    {
        this.simpleAlert( LocalizeText(('opening.hours.' + (thrownOut ? 'disconnected' : 'closed')), [ 'h', 'm'], [ this.getTimeZeroPadded(open), this.getTimeZeroPadded(minute) ]), NotificationAlertType.DEFAULT, null, null, LocalizeText('opening.hours.title'));
    }

    public static handleHotelMaintenanceMessage(minutesUntilMaintenance: number, duration: number): void
    {
        this.simpleAlert(LocalizeText('maintenance.shutdown', [ 'm', 'd' ], [ minutesUntilMaintenance.toString(), duration.toString() ]), NotificationAlertType.DEFAULT, null, null, LocalizeText('opening.hours.title'));
    }

    public static handleHotelClosingMessage(minutes: number): void
    {
        this.simpleAlert(LocalizeText('opening.hours.shutdown', [ 'm' ], [ minutes.toString() ]), NotificationAlertType.DEFAULT, null, null, LocalizeText('opening.hours.title'));
    }

    public static handleLoginFailedHotelClosedMessage(openHour: number, openMinutes: number): void
    {
        this.simpleAlert(LocalizeText('opening.hours.disconnected', [ 'h', 'm' ], [ openHour.toString(), openMinutes.toString() ]), NotificationAlertType.DEFAULT, null, null, LocalizeText('opening.hours.title'));
    }

    public static openUrl(url: string): void
    {
        if(!url || !url.length) return;
        
        if(url.startsWith('http'))
        {
            HabboWebTools.openWebPage(url);
        }
        else
        {
            CreateLinkEvent(url);
        }
    }

    public static showModerationDisclaimer(): void
    {
        if(RoomEnterEffect.isRunning())
        {
            if(this.MODERATION_DISCLAIMER_TIMEOUT) return;

            this.MODERATION_DISCLAIMER_TIMEOUT = setTimeout(() =>
            {
                this.showModerationDisclaimer();
            }, (RoomEnterEffect.totalRunningTime + this.MODERATION_DISCLAIMER_DELAY_MS));
        }
        else
        {
            if(this.MODERATION_DISCLAIMER_SHOWN) return;

            this.showSingleBubble(LocalizeText('mod.chatdisclaimer'), NotificationBubbleType.INFO);

            this.MODERATION_DISCLAIMER_SHOWN = true;
        }
    }
}
