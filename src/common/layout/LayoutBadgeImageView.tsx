import { BadgeImageReadyEvent, GetEventDispatcher, GetSessionDataManager, NitroSprite, TextureUtils } from '@nitrots/nitro-renderer';
import { CSSProperties, FC, useEffect, useMemo, useState } from 'react';
import { GetConfigurationValue, LocalizeBadgeDescription, LocalizeBadgeName, LocalizeText } from '../../api';
import { Base, BaseProps } from '../Base';

export interface LayoutBadgeImageViewProps extends BaseProps<HTMLDivElement>
{
    badgeCode: string;
    isGroup?: boolean;
    showInfo?: boolean;
    customTitle?: string;
    isGrayscale?: boolean;
    scale?: number;
}

export const LayoutBadgeImageView: FC<LayoutBadgeImageViewProps> = props =>
{
    const { badgeCode = null, isGroup = false, showInfo = false, customTitle = null, isGrayscale = false, scale = 1, classNames = [], style = {}, children = null, ...rest } = props;
    const [ imageElement, setImageElement ] = useState<HTMLImageElement>(null);

    const getClassNames = useMemo(() =>
    {
        const newClassNames: string[] = [ 'relative w-[40px] h-[40px] bg-no-repeat bg-center' ];

        if(isGroup) newClassNames.push('group-badge');

        if(isGrayscale) newClassNames.push('grayscale');

        if(classNames.length) newClassNames.push(...classNames);

        return newClassNames;
    }, [ classNames, isGroup, isGrayscale ]);

    const getStyle = useMemo(() =>
    {
        let newStyle: CSSProperties = {};

        if(imageElement)
        {
            newStyle.backgroundImage = `url(${ (isGroup) ? imageElement.src : GetConfigurationValue<string>('badge.asset.url').replace('%badgename%', badgeCode.toString()) })`;
            newStyle.width = imageElement.width;
            newStyle.height = imageElement.height;

            if(scale !== 1)
            {
                newStyle.transform = `scale(${ scale })`;

                if(!(scale % 1)) newStyle.imageRendering = 'pixelated';

                newStyle.width = (imageElement.width * scale);
                newStyle.height = (imageElement.height * scale);
            }
        }

        if(Object.keys(style).length) newStyle = { ...newStyle, ...style };

        return newStyle;
    }, [ badgeCode, isGroup, imageElement, scale, style ]);

    useEffect(() =>
    {
        if(!badgeCode || !badgeCode.length) return;

        let didSetBadge = false;

        const onBadgeImageReadyEvent = async (event: BadgeImageReadyEvent) =>
        {
            if(event.badgeId !== badgeCode) return;

            const element = await TextureUtils.generateImage(new NitroSprite(event.image));

            element.onload = () => setImageElement(element);

            didSetBadge = true;

            GetEventDispatcher().removeEventListener(BadgeImageReadyEvent.IMAGE_READY, onBadgeImageReadyEvent);
        };

        GetEventDispatcher().addEventListener(BadgeImageReadyEvent.IMAGE_READY, onBadgeImageReadyEvent);

        const texture = isGroup ? GetSessionDataManager().getGroupBadgeImage(badgeCode) : GetSessionDataManager().getBadgeImage(badgeCode);

        if(texture && !didSetBadge)
        {
            (async () =>
            {
                const element = await TextureUtils.generateImage(new NitroSprite(texture));

                element.onload = () => setImageElement(element);
            })();
        }

        return () => GetEventDispatcher().removeEventListener(BadgeImageReadyEvent.IMAGE_READY, onBadgeImageReadyEvent);
    }, [ badgeCode, isGroup ]);

    return (
        <Base className="group" classNames={ getClassNames } style={ getStyle } { ...rest }>
            { (showInfo && GetConfigurationValue<boolean>('badge.descriptions.enabled', true)) &&
                <Base className="hidden group-hover:block  before:absolute before:content-['_'] before:w-[0] before:h-[0] before:!border-l-[10px] before:!border-b-[10px] before:!border-t-[10px] before:top-[10px] before:-right-[10px] before:[border-left-color:white] before:[border-top-color:transparent] before:[border-bottom-color:transparent] z-50 absolute pointer-events-none select-none w-[210px] rounded-[.25rem] bg-[#fff] -left-[220px] text-black py-1 px-2 small">
                    <div className="font-bold mb-1">{ isGroup ? customTitle : LocalizeBadgeName(badgeCode) }</div>
                    <div>{ isGroup ? LocalizeText('group.badgepopup.body') : LocalizeBadgeDescription(badgeCode) }</div>
                </Base> }
            { children }
        </Base>
    );
};
