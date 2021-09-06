import { BadgeImageReadyEvent, NitroSprite, TextureUtils } from '@nitrots/nitro-renderer';
import { FC, useCallback, useEffect, useState } from 'react';
import { GetSessionDataManager, LocalizeBadgeDescription, LocalizeBadgeName, LocalizeText } from '../../../api';
import { BadgeInformationView } from './badge-info/BadgeInformationView';
import { BadgeImageViewProps } from './BadgeImageView.types';

export const BadgeImageView: FC<BadgeImageViewProps> = props =>
{
    const { badgeCode = null, isGroup = false, showInfo = false, customTitle = null } = props;

    const [ badgeUrl, setBadgeUrl ] = useState<string>('');
    const [ isListening, setIsListening ] = useState<boolean>(true);

    const onBadgeImageReadyEvent = useCallback((event: BadgeImageReadyEvent) =>
    {
        if(event.badgeId !== badgeCode) return;

        const nitroSprite = new NitroSprite(event.image);
        setBadgeUrl(TextureUtils.generateImageUrl(nitroSprite));

        if(isListening)
        {
            GetSessionDataManager().events.removeEventListener(BadgeImageReadyEvent.IMAGE_READY, onBadgeImageReadyEvent);
            setIsListening(false);
        }
    }, [ badgeCode, isListening ]);

    useEffect(() =>
    {
        const existing = (isGroup) ? GetSessionDataManager().loadGroupBadgeImage(badgeCode) : GetSessionDataManager().loadBadgeImage(badgeCode);

        if(!existing)
        {
            GetSessionDataManager().events.addEventListener(BadgeImageReadyEvent.IMAGE_READY, onBadgeImageReadyEvent);
        }
        else
        {
            const image = (isGroup) ? GetSessionDataManager().getGroupBadgeImage(badgeCode) : GetSessionDataManager().getBadgeImage(badgeCode);
            const nitroSprite = new NitroSprite(image);
            setBadgeUrl(TextureUtils.generateImageUrl(nitroSprite));
        }

        return (() =>
        {
            if(isListening)
            {
                GetSessionDataManager().events.removeEventListener(BadgeImageReadyEvent.IMAGE_READY, onBadgeImageReadyEvent);
            }
        });
    }, [ badgeCode ]);

    const url = `url('${ badgeUrl }')`;

    return <div className="badge-image" style={ (url && url.length) ? { backgroundImage: url } : {} }>
        { showInfo && <BadgeInformationView title={ isGroup ? customTitle : LocalizeBadgeName(badgeCode) } description={ isGroup ? LocalizeText('group.badgepopup.body') : LocalizeBadgeDescription(badgeCode) } /> }
    </div>;
}
