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

        if(isGroup) newClassNames.push('group-badge');

        if(isGrayscale) newClassNames.push('grayscale');

        if((scale !== 1) && getScaleClass.length) newClassNames.push(getScaleClass);

        if(classNames.length) newClassNames.push(...classNames);

        return newClassNames;
    }, [ classNames, isGroup, isGrayscale, scale, getScaleClass ]);

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

        let didSetBadge = false;

        const onBadgeImageReadyEvent = (event: BadgeImageReadyEvent) =>
        {
            if(event.badgeId !== badgeCode) return;

            setBadgeUrl(TextureUtils.generateImageUrl(new NitroSprite(event.image)));

            didSetBadge = true;
            
            GetSessionDataManager().events.removeEventListener(BadgeImageReadyEvent.IMAGE_READY, onBadgeImageReadyEvent);
        }

        GetSessionDataManager().events.addEventListener(BadgeImageReadyEvent.IMAGE_READY, onBadgeImageReadyEvent);

        const texture = isGroup ? GetSessionDataManager().getGroupBadgeImage(badgeCode) : GetSessionDataManager().getBadgeImage(badgeCode);

        if(texture && !didSetBadge) setBadgeUrl(TextureUtils.generateImageUrl(new NitroSprite(texture)));

        return () => GetSessionDataManager().events.removeEventListener(BadgeImageReadyEvent.IMAGE_READY, onBadgeImageReadyEvent);
    }, [ badgeCode, isGroup ]);

    return (
        <Base classNames={ getClassNames } style={ getStyle } { ...rest }>
            { showInfo && <BadgeInformationView title={ isGroup ? customTitle : LocalizeBadgeName(badgeCode) } description={ isGroup ? LocalizeText('group.badgepopup.body') : LocalizeBadgeDescription(badgeCode) } /> }
            { children }
        </Base>
    );
}
