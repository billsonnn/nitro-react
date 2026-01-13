import { FC, useMemo } from "react"
import { GetConfiguration } from "../../api"
import { BaseProps } from "../Base"

export interface LayoutRoomThumbnailViewProps extends BaseProps<HTMLDivElement>
{
    roomId?: number;
    customUrl?: string;
    isRoom?: boolean;
    isNavigator?: boolean;
    type?: string;
}

export const LayoutRoomThumbnailView: FC<LayoutRoomThumbnailViewProps> = props =>
{
    const { roomId = -1, isRoom = false, isNavigator = false, type = "default", customUrl = null, classNames = [], className = "", children = null, ...rest } = props

    const getClassNames = useMemo(() =>
    {
        const newClassNames: string[] = [ "relative overflow-hidden shrink-0" ]
        
        if(type === "r63") newClassNames.push("!w-[70px] !h-16")
        newClassNames.push("w-[106px] h-[107px]")

        if(classNames.length) newClassNames.push(...classNames)

        return newClassNames
    }, [ classNames ])

    const getClassName = useMemo(() =>
    {
        let newClassName = getClassNames.join(" ")

        if(className.length) newClassName += (" " + className)

        return newClassName.trim()
    }, [ getClassNames, className ])

    const getImageUrl = useMemo(() => {
        if (customUrl && customUrl.length) {
            return `${GetConfiguration<string>("image.library.url")}${customUrl}?cache=${Math.random()}`
        }
    
        return `${GetConfiguration<string>("thumbnails.url").replace("%thumbnail%", roomId.toString())}?cache=${Math.random()}`
    }, [ customUrl, roomId ])

    if(isNavigator) return (
        <div className="absolute left-0 top-0 size-full bg-cover bg-center" style={{ backgroundImage: `url(${getImageUrl})` }} />
    )

    return (
        <div className={ getClassName } { ...rest }>
            <div className="absolute left-0 top-0 size-full bg-cover bg-center" style={{ backgroundImage: `url(${getImageUrl})` }} />
            { type === "r63" && <>
                <img src="/client-assets/images/rooms/default-thumbnail.png?v=2451779" />
                <div className="absolute left-0 top-0 size-full bg-[url('/client-assets/images/rooms/thumbnail-mini-bg.png?v=2451779')] dark:bg-[url('/client-assets/images/rooms/thumbnail-mini-dark-bg.png?v=2451779')]" />
            </> }
            { (type === "default" || type === "r63Large") && <>
                <img src="/client-assets/images/rooms/default-thumbnail.png?v=2451779" />
                <div className={`absolute left-0 top-0 size-full ${isRoom ? "bg-[url('/client-assets/images/rooms/thumbnail-bg.png?v=2451779')] dark:bg-[url('/client-assets/images/rooms/thumbnail-dark-bg.png?v=2451779')]" : "bg-[url('/client-assets/images/rooms/thumbnail-no-count-bg.png?v=2451779')] dark:bg-[url('/client-assets/images/rooms/thumbnail-no-count-dark-bg.png?v=2451779')]"}`} />
            </> }
            { children }
        </div>
    )
}
