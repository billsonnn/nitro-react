import { HabboWebTools, RoomEnterEffect } from '@nitrots/nitro-renderer';
import { CreateLinkEvent, GetConfiguration, GetNitroInstance, LocalizeText } from '../../../api';
import { SimpleAlertUIEvent } from '../../../events';
import { NotificationBubbleEvent } from '../../../events/notification-center/NotificationBubbleEvent';
import { dispatchUiEvent } from '../../../hooks';
import { CatalogPageName } from '../../catalog/common/CatalogPageName';
import { NotificationType } from './NotificationType';

export class NotificationUtilities
{
    private static MODERATION_DISCLAIMER_SHOWN: boolean = false;
    private static MODERATION_DISCLAIMER_DELAY_MS: number = 5000;
    private static MODERATION_DISCLAIMER_TIMEOUT: ReturnType<typeof setTimeout> = null;

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

        // eslint-disable-next-line no-template-curly-in-string
        if(!imageUrl) imageUrl = ('${image.library.url}notifications/' + type.replace(/\./g, '_') + '.png');

        return imageUrl;
    }

    public static showNotification(type: string, options: Map<string, string> = null): void
    {
        if(!options) options = new Map();

        const configuration = this.getNotificationConfig(('notification.' + type));

        if(configuration)
        {
            for(const key in configuration) options.set(key, configuration[key]);
        }

        console.log(options);

        if(options.get('display') === 'BUBBLE')
        {
            const message = this.getNotificationPart(options, type, 'message', true);
            const linkUrl = this.getNotificationPart(options, type, 'linkUrl', false);
            const isEventLink = (linkUrl && linkUrl.substr(0, 6) === 'event');
            const image = this.getNotificationImageUrl(options, type);

            dispatchUiEvent(new NotificationBubbleEvent(LocalizeText(message), NotificationType.INFO, LocalizeText(image), (isEventLink ? linkUrl.substr(6) : linkUrl)));
        }
        else
        {

        }
    }

    public static showSingleBubble(message: string, type: string, imageUrl: string = null, internalLink: string = null): void
    {
        dispatchUiEvent(new NotificationBubbleEvent(message, type, imageUrl, internalLink));
    }

    public static simpleAlert(message: string, clickUrl: string = null, clickUrlText: string = null, title: string = null, imageUrl: string = null): void
    {
        if(!title || !title.length) title = LocalizeText('notifications.broadcast.title');

        dispatchUiEvent(new SimpleAlertUIEvent(message, clickUrl, clickUrlText, title, imageUrl));
    }

    public static alert(title: string, message: string): void
    {
        dispatchUiEvent(new SimpleAlertUIEvent(message, null, null, title, null));
    }

    public static showClubGiftNotification(numGifts: number): void
    {
        if(numGifts <= 0) return;

        dispatchUiEvent(new NotificationBubbleEvent(numGifts.toString(), NotificationType.CLUBGIFT, null, 'catalog/open/' + CatalogPageName.CLUB_GIFTS));
    }

    public static showModeratorMessage(message: string, url: string = null): void
    {
        this.simpleAlert(this.cleanText(message), url, LocalizeText('mod.alert.link'), LocalizeText('mod.alert.title'));
    }

    public static handleHotelClosedMessage(open: number, minute: number, thrownOut: boolean): void
    {
        const text: string = LocalizeText(('opening.hours.' + (thrownOut ? 'disconnected' : 'closed')), [ 'h', 'm'], [ this.getTimeZeroPadded(open), this.getTimeZeroPadded(minute) ]);;

        this.alert(LocalizeText('opening.hours.title'), text);
    }

    public static openUrl(url: string): void
    {
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

            this.showSingleBubble(LocalizeText('mod.chatdisclaimer'), NotificationType.INFO);

            this.MODERATION_DISCLAIMER_SHOWN = true;
        }
    }
}
