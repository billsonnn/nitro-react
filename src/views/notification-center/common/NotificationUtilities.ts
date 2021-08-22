import { GetConfiguration, GetNitroInstance, LocalizeText } from '../../../api';
import { NotificationBubbleEvent } from '../../../events/notification-center/NotificationBubbleEvent';
import { dispatchUiEvent } from '../../../hooks';
import { NotificationType } from './NotificationType';

export class NotificationUtilities
{
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

            dispatchUiEvent(new NotificationBubbleEvent(message, NotificationType.INFO, image, (isEventLink ? linkUrl.substr(6) : linkUrl)));
        }
        else
        {

        }
    }

    public static showSingleBubble(message: string, type: string, imageUrl: string = null, internalLink: string = null): void
    {
        dispatchUiEvent(new NotificationBubbleEvent(message, type, imageUrl, internalLink));
    }
}
