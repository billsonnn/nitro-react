import { BadgeImageReadyEvent, NitroSprite, TextureUtils } from '@nitrots/nitro-renderer';
import { CSSProperties, FC, useEffect, useMemo, useState } from 'react';
import { GetSessionDataManager, LocalizeBadgeDescription, LocalizeBadgeName, LocalizeText } from '../../../api';
import { Base, BaseProps } from '../../../common/Base';
import { BadgeInformationView } from './badge-info/BadgeInformationView';

export interface BadgeImageViewProps extends BaseProps<HTMLDivElement>
{
    badgeCode: string;
    isGroup?: boolean;
    showInfo?: boolean;
    customTitle?: string;
    isGrayscale?: boolean;
    scale?: number;
}

export const BadgeImageView: FC<BadgeImageViewProps> = props =>
{
    const { badgeCode = null, isGroup = false, showInfo = false, customTitle = null, isGrayscale = false, scale = 1, classNames = [], style = {}, children = null, ...rest } = props;
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

    const getClassNames = useMemo(() =>
    {
        const newClassNames: string[] = [ 'badge-image' ];

        if(isGrayscale) newClassNames.push('grayscale');

        if((scale !== 1) && getScaleClass.length) newClassNames.push(getScaleClass);

        if(classNames.length) newClassNames.push(...classNames);

        return newClassNames;
    }, [ classNames, isGrayscale, scale, getScaleClass ]);

    const getStyle = useMemo(() =>
    {
        let newStyle: CSSProperties = {};

        if(badgeUrl && badgeUrl.length) newStyle.backgroundImage = `url(${ badgeUrl })`;

        if(Object.keys(style).length) newStyle = { ...newStyle, ...style };

        return newStyle;
    }, [ style, badgeUrl ]);

    useEffect(() =>
    {
        if(!badgeCode || !badgeCode.length) return;
        
        const existing = (isGroup) ? GetSessionDataManager().loadGroupBadgeImage(badgeCode) : GetSessionDataManager().loadBadgeImage(badgeCode);

        const onBadgeImageReadyEvent = (event: BadgeImageReadyEvent) =>
        {
            if(event.badgeId !== badgeCode) return;

            const nitroSprite = new NitroSprite(event.image);
            setBadgeUrl(TextureUtils.generateImageUrl(nitroSprite));

            if(isListening)
            {
                GetSessionDataManager().events.removeEventListener(BadgeImageReadyEvent.IMAGE_READY, onBadgeImageReadyEvent);
                setIsListening(false);
            }
        }

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
    }, [ badgeCode, isGroup, isListening ]);

    return (
        <Base classNames={ getClassNames } style={ getStyle } { ...rest }>
            { showInfo && <BadgeInformationView title={ isGroup ? customTitle : LocalizeBadgeName(badgeCode) } description={ isGroup ? LocalizeText('group.badgepopup.body') : LocalizeBadgeDescription(badgeCode) } /> }
            { children }
        </Base>
    );
}
