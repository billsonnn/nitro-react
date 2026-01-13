import { BadgeImageReadyEvent, NitroSprite, TextureUtils } from "@nitrots/nitro-renderer"
import { CSSProperties, FC, useEffect, useMemo, useRef, useState } from "react"
import { GetConfiguration, GetSessionDataManager, LocalizeBadgeDescription, LocalizeBadgeName, LocalizeText } from "../../api"
import { BaseProps } from "../Base"

export interface LayoutBadgeImageViewProps extends BaseProps<HTMLDivElement>
{
    badgeCode: string;
    isGroup?: boolean;
    showInfo?: boolean;
    customTitle?: string;
    isGrayscale?: boolean;
    isShadow?: boolean;
    scale?: number;
}

export const LayoutBadgeImageView: FC<LayoutBadgeImageViewProps> = props =>
{
    const { badgeCode = null, isGroup = false, showInfo = false, customTitle = null, isGrayscale = false, isShadow = false, scale = 1, classNames = [], className = "", style = {}, children = null, ...rest } = props
    const [ imageElement, setImageElement ] = useState<HTMLImageElement>(null)
    const elementRef = useRef<HTMLDivElement>()
    const [ isVisible, setIsVisible ] = useState(false)

    const getClassNames = useMemo(() =>
    {
        const newClassNames: string[] = []

        if(isGroup) newClassNames.push("group-badge")

        if(isGrayscale) newClassNames.push("grayscale")

        if(isShadow) newClassNames.push("drop-shadow-[0px_1px_0_#fff] dark:drop-shadow-[0px_1px_0_#33312B]")

        if(classNames.length) newClassNames.push(...classNames)

        return newClassNames
    }, [ classNames, isGroup, isGrayscale ])

    const getClassName = useMemo(() =>
    {
        let newClassName = getClassNames.join(" ")

        if(className.length) newClassName += (" " + className)

        return newClassName.trim()
    }, [ getClassNames, className ])

    const getStyle = useMemo(() =>
    {
        let newStyle: CSSProperties = {}

        if(imageElement)
        {
            newStyle.backgroundImage = `url(${ (isGroup) ? imageElement.src : GetConfiguration<string>("badge.asset.url").replace("%badgename%", badgeCode.toString())})`
            newStyle.width = imageElement.width
            newStyle.height = imageElement.height

            if(scale !== 1)
            {
                newStyle.transform = `scale(${ scale })`

                if(!(scale % 1)) newStyle.imageRendering = "pixelated"

                newStyle.width = (imageElement.width * scale)
                newStyle.height = (imageElement.height * scale)
            }
        }

        if(Object.keys(style).length) newStyle = { ...newStyle, ...style }

        return newStyle
    }, [ imageElement, scale, style ])

    useEffect(() =>
    {
        if(!badgeCode || !badgeCode.length) return

        let didSetBadge = false

        const onBadgeImageReadyEvent = (event: BadgeImageReadyEvent) =>
        {
            if(event.badgeId !== badgeCode) return

            const element = TextureUtils.generateImage(new NitroSprite(event.image))

            element.onload = () => setImageElement(element)

            didSetBadge = true

            GetSessionDataManager().events.removeEventListener(BadgeImageReadyEvent.IMAGE_READY, onBadgeImageReadyEvent)
        }

        GetSessionDataManager().events.addEventListener(BadgeImageReadyEvent.IMAGE_READY, onBadgeImageReadyEvent)

        const texture = isGroup ? GetSessionDataManager().getGroupBadgeImage(badgeCode) : GetSessionDataManager().getBadgeImage(badgeCode)

        if(texture && !didSetBadge)
        {
            const element = TextureUtils.generateImage(new NitroSprite(texture))

            element.onload = () => setImageElement(element)
        }

        return () => GetSessionDataManager().events.removeEventListener(BadgeImageReadyEvent.IMAGE_READY, onBadgeImageReadyEvent)
    }, [ badgeCode, isGroup ])

    return (
        <div ref={ elementRef } onMouseOver={ event => setIsVisible(true) } onMouseLeave={ event => setIsVisible(false) } className={ getClassName } style={ getStyle } { ...rest }>
            { showInfo && isVisible &&
                <div className="illumina-badge-details pixelated z-[9999]">
                    <p className="mb-1 font-volter_bold text-[9px] !leading-3">{ isGroup ? customTitle : LocalizeBadgeName(badgeCode) }</p>
                    { GetConfiguration<boolean>("badge.descriptions.enabled", true) && <p className="font-volter text-[9px] !leading-3">{ isGroup ? LocalizeText("group.badgepopup.body") : LocalizeBadgeDescription(badgeCode) }</p> }
                </div> }
            { children }
        </div>
    )
}
