import { NitroConfiguration, RoomSessionEvent } from "@nitrots/nitro-renderer"
import { FC, useState } from "react"
import { GetConfiguration, TryVisitRoom } from "../../api"
import { LayoutAvatarImageView } from "../../common"
import { useRoomSessionManagerEvent, useSessionInfo } from "../../hooks"

const widgetSlotCount = 7

export const HotelView: FC<{}> = props =>
{
    const [ isVisible, setIsVisible ] = useState(true)
    const { userFigure = null } = useSessionInfo()

    useRoomSessionManagerEvent<RoomSessionEvent>([
        RoomSessionEvent.CREATED,
        RoomSessionEvent.ENDED ], event =>
    {
        switch(event.type)
        {
        case RoomSessionEvent.CREATED:
            setIsVisible(false)
            return
        case RoomSessionEvent.ENDED:
            setIsVisible(event.openLandingView)
            return
        }
    })

    if(!isVisible) return null

    // Interactive Hotelview
    const interactiveHotelViewEnabled = GetConfiguration("illumina.interactive.hotelview")["enabled"]
    const interactiveHotelViewTheme = GetConfiguration("illumina.interactive.hotelview")["theme"]
    const interactiveHotelViewRooms = GetConfiguration("illumina.interactive.hotelview")["rooms"]
    const interactiveHotelViewShowDrape = GetConfiguration("illumina.interactive.hotelview")["show.drape"]
    const interactiveHotelViewDrapeImage = NitroConfiguration.interpolate(GetConfiguration("illumina.interactive.hotelview")["drape.image"])
    
    // Classic Hotelview
    const backgroundColor = GetConfiguration("hotelview")["images"]["background.colour"]
    const background = NitroConfiguration.interpolate(GetConfiguration("hotelview")["images"]["background"])
    const sun = NitroConfiguration.interpolate(GetConfiguration("hotelview")["images"]["sun"])
    const drape = NitroConfiguration.interpolate(GetConfiguration("hotelview")["images"]["drape"])
    const left = NitroConfiguration.interpolate(GetConfiguration("hotelview")["images"]["left"])
    const rightRepeat = NitroConfiguration.interpolate(GetConfiguration("hotelview")["images"]["right.repeat"])
    const right = NitroConfiguration.interpolate(GetConfiguration("hotelview")["images"]["right"])

    if(interactiveHotelViewEnabled) return (
        <div className="fixed block size-full bg-[#84CCE8]">
            { interactiveHotelViewShowDrape &&
                <div className="absolute left-[3vw] top-0 z-0 size-full bg-no-repeat" style={{ backgroundImage: `url(${interactiveHotelViewDrapeImage})` }} /> }
            <div className="absolute bottom-[-105px] left-0 z-10 lg:left-[15vw] 2xl:left-[23vw]">
                <div className="relative mb-[-200px]">
                    <div className="relative left-0 top-0 ml-[-1005px] mt-[-19px] h-[1185px] w-[3000px]" style={{ backgroundImage: `url(/client-assets/images/hotelview/hotelview_${interactiveHotelViewTheme}.png)` }} />
                    {interactiveHotelViewRooms.filter((room: any) => room.show).map((room: any) => (
                        <div key={room.id} className="group absolute flex cursor-pointer justify-center hover:z-20 " style={{ width: room.style.width, height: room.style.height, top: room.style.top, left: room.style.left }} onClick={ (e) => TryVisitRoom(room.roomId) }>
                            <div className="size-full group-hover:drop-shadow-[1px_3px_20px_#000000]" style={{ backgroundImage: `url(/client-assets/images/hotelview/rooms/${interactiveHotelViewTheme + "-" + room.id}.gif)` }} />
                            <i className="invisible absolute h-[56px] w-[32px] bg-[url('/client-assets/images/hotelview/arrow-down.gif')] group-hover:visible" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )

    return (
        <div className="fixed block h-[calc(100%_-_51px)] w-full" style={{ backgroundImage: `url(${background ? background : backgroundColor})` }}>
            <div className="absolute top-0 size-full bg-left bg-repeat-y" style={ (background && background.length) ? { backgroundImage: `url(${ background })` } : {} } />
            <div className="absolute inset-x-0 top-0 m-auto size-full bg-[top_center] bg-no-repeat" style={ (sun && sun.length) ? { backgroundImage: `url(${ sun })` } : {} } />
            <div className="absolute left-0 top-0 z-10 size-full bg-no-repeat" style={ (drape && drape.length) ? { backgroundImage: `url(${ drape })` } : {} } />
            <div className="absolute inset-0 bg-left-bottom bg-no-repeat" style={ (left && left.length) ? { backgroundImage: `url(${ left })` } : {} } />
            <div className="absolute right-0 top-0 size-full bg-right-top bg-no-repeat" style={ (rightRepeat && rightRepeat.length) ? { backgroundImage: `url(${ rightRepeat })` } : {} } />
            <div className=" absolute bottom-0 right-0 size-full bg-right-bottom bg-no-repeat" style={ (right && right.length) ? { backgroundImage: `url(${ right })` } : {} } />
            { GetConfiguration("hotelview")["show.avatar"] && (
                <div className="view-avatar absolute bottom-[30px] left-[110px] z-20">
                    <LayoutAvatarImageView figure={ userFigure } direction={ 2 } />
                </div>
            ) }
        </div>
    )
}
