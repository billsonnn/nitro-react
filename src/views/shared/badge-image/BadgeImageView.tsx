import { BadgeImageReadyEvent, NitroSprite, TextureUtils } from '@nitrots/nitro-renderer';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { GetSessionDataManager, LocalizeBadgeDescription, LocalizeBadgeName, LocalizeText } from '../../../api';
import { NitroLayoutBase } from '../../../layout/base';
import { BadgeInformationView } from './badge-info/BadgeInformationView';
import { BadgeImageViewProps } from './BadgeImageView.types';

export const BadgeImageView: FC<BadgeImageViewProps> = props =>
{
    const { badgeCode = null, isGroup = false, showInfo = false, customTitle = null, isGrayscale = false, scale = 1, className = '', style = null, children = null, ...rest } = props;
    const [ badgeUrl, setBadgeUrl ] = useState<string>('');
    const [ isListening, setIsListening ] = useState<boolean>(true);

    const getScaleClass = useMemo(() =>
    {
        let scaleName = scale.toString();

        if(scale === .5) scaleName = '0-5';

        else if(scale === .75) scaleName = '0-75';

        else if(scale === 1.25) scaleName = '1-25';

        else if(scale === 1.50) scaleName = '1-50';

        return `scale-${ scaleName }`;
    }, [ scale ]);

    const getClassName = useMemo(() =>
    {
        let newClassName = 'badge-image';

        if(isGrayscale) newClassName += ' grayscale';

        if((scale !== 1) && getScaleClass.length) newClassName += ` ${ getScaleClass }`;

        if(className && className.length) newClassName += ' ' + className;

        return newClassName;
    }, [ className, isGrayscale, scale, getScaleClass ]);

    const getStyle = useMemo(() =>
    {
        const newStyle = { ...style };

        if(badgeUrl && badgeUrl.length) newStyle.backgroundImage = `url(${ badgeUrl })`;

        return newStyle;
    }, [ style, badgeUrl ]);

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
        if(!badgeCode || !badgeCode.length) return;
        
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

    return (
        <NitroLayoutBase className={ getClassName } style={ getStyle }>
            { showInfo && <BadgeInformationView title={ isGroup ? customTitle : LocalizeBadgeName(badgeCode) } description={ isGroup ? LocalizeText('group.badgepopup.body') : LocalizeBadgeDescription(badgeCode) } /> }
            { children }
        </NitroLayoutBase>
    );
}
