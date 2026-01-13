import { RoomChatSettings } from "@nitrots/nitro-renderer"
import { FC, useEffect, useMemo, useState } from "react"
import { IRoomData, LocalizeText } from "../../../../api"
import { usePurse } from "../../../../hooks"

interface NavigatorRoomSettingsTabViewProps
{
    roomData: IRoomData;
    handleChange: (field: string, value: string | number | boolean) => void;
}

export const NavigatorRoomSettingsVipChatTabView: FC<NavigatorRoomSettingsTabViewProps> = props =>
{
    const { roomData = null, handleChange = null } = props
    const [ chatDistance, setChatDistance ] = useState<number>(0)
    const { purse = null } = usePurse()
    
    const isSubscription = useMemo(() =>
    {
        const clubDays = purse.clubDays
        const clubPeriods = purse.clubPeriods
        const totalDays = (clubPeriods * 31) + clubDays

        return totalDays
    }, [ purse ])

    useEffect(() =>
    {
        setChatDistance(roomData.chatSettings.distance)
    }, [ roomData.chatSettings ])

    return (
        <div className="mt-2 flex flex-col gap-2">
            <div className="mb-3">
                <p className="mb-1 text-sm font-semibold !leading-3 [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">{ LocalizeText("navigator.roomsettings.vip.caption") }</p>
                <p className="text-sm">{ LocalizeText("navigator.roomsettings.vip.info") }</p>
            </div>
            <div className="flex flex-col gap-3">
                <div className={`relative ${isSubscription > 0 ? "" : "opacity-50"}`}>
                    <p className="mb-1 text-sm font-semibold !leading-3 [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">{ LocalizeText("navigator.roomsettings.vip_settings") }</p>
                    <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-1.5">
                            <input id="hideWalls" className="illumina-input" type="checkbox" checked={ roomData.hideWalls } onChange={ event => handleChange("hide_walls", event.target.checked) } />
                            <label htmlFor="hideWalls" className="cursor-pointer text-sm">{ LocalizeText("navigator.roomsettings.hide_walls") }</label>
                        </div>
                        <div className="illumina-select relative flex h-6 items-center gap-[3px] px-2.5">
                            <select className="w-full bg-transparent text-sm" value={ roomData.wallThickness } onChange={ event => handleChange("wall_thickness", event.target.value) }>
                                <option className="!text-black" value="0">{ LocalizeText("navigator.roomsettings.wall_thickness.normal") }</option>
                                <option className="!text-black" value="1">{ LocalizeText("navigator.roomsettings.wall_thickness.thick") }</option>
                                <option className="!text-black" value="-1">{ LocalizeText("navigator.roomsettings.wall_thickness.thin") }</option>
                                <option className="!text-black" value="-2">{ LocalizeText("navigator.roomsettings.wall_thickness.thinnest") }</option>
                            </select>
                            <i className="pointer-events-none h-2 w-3 bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-269px_-23px]" />
                        </div>
                        <div className="illumina-select relative flex h-6 items-center gap-[3px] px-2.5">
                            <select className="w-full bg-transparent text-sm" value={ roomData.floorThickness } onChange={ event => handleChange("floor_thickness", event.target.value) }>
                                <option className="!text-black" value="0">{ LocalizeText("navigator.roomsettings.floor_thickness.normal") }</option>
                                <option className="!text-black" value="1">{ LocalizeText("navigator.roomsettings.floor_thickness.thick") }</option>
                                <option className="!text-black" value="-1">{ LocalizeText("navigator.roomsettings.floor_thickness.thin") }</option>
                                <option className="!text-black" value="-2">{ LocalizeText("navigator.roomsettings.floor_thickness.thinnest") }</option>
                            </select>
                            <i className="pointer-events-none h-2 w-3 bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-269px_-23px]" />
                        </div>
                    </div>
                    { isSubscription > 0 ? null : <div className="absolute left-0 top-0 z-10 size-full" /> }
                </div>
                <div className="flex flex-col">
                    <p className="mb-1 text-sm font-semibold !leading-3 [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">{ LocalizeText("navigator.roomsettings.chat_settings") }</p>
                    <p className="mb-1.5 text-sm">{ LocalizeText("navigator.roomsettings.chat_settings.info") }</p>
                    <div className="flex flex-col gap-1.5">
                        <div className="illumina-select relative flex h-6 items-center gap-[3px] px-2.5">
                            <select className="w-full bg-transparent text-sm" value={ roomData.chatSettings.mode } onChange={ event => handleChange("bubble_mode", event.target.value) }>
                                <option className="!text-black" value={ RoomChatSettings.CHAT_MODE_FREE_FLOW }>{ LocalizeText("navigator.roomsettings.chat.mode.free.flow") }</option>
                                <option className="!text-black" value={ RoomChatSettings.CHAT_MODE_LINE_BY_LINE }>{ LocalizeText("navigator.roomsettings.chat.mode.line.by.line") }</option>
                            </select>
                            <i className="pointer-events-none h-2 w-3 bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-269px_-23px]" />
                        </div>
                        <div className="illumina-select relative flex h-6 items-center gap-[3px] px-2.5">
                            <select className="w-full bg-transparent text-sm" value={ roomData.chatSettings.weight } onChange={ event => handleChange("chat_weight", event.target.value) }>
                                <option className="!text-black" value={ RoomChatSettings.CHAT_BUBBLE_WIDTH_NORMAL }>{ LocalizeText("navigator.roomsettings.chat.bubbles.width.normal") }</option>
                                <option className="!text-black" value={ RoomChatSettings.CHAT_BUBBLE_WIDTH_THIN }>{ LocalizeText("navigator.roomsettings.chat.bubbles.width.thin") }</option>
                                <option className="!text-black" value={ RoomChatSettings.CHAT_BUBBLE_WIDTH_WIDE }>{ LocalizeText("navigator.roomsettings.chat.bubbles.width.wide") }</option>
                            </select>
                            <i className="pointer-events-none h-2 w-3 bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-269px_-23px]" />
                        </div>
                        <div className="illumina-select relative flex h-6 items-center gap-[3px] px-2.5">
                            <select className="w-full bg-transparent text-sm" value={ roomData.chatSettings.speed } onChange={ event => handleChange("bubble_speed", event.target.value) }>
                                <option className="!text-black" value={ RoomChatSettings.CHAT_SCROLL_SPEED_FAST }>{ LocalizeText("navigator.roomsettings.chat.speed.fast") }</option>
                                <option className="!text-black" value={ RoomChatSettings.CHAT_SCROLL_SPEED_NORMAL }>{ LocalizeText("navigator.roomsettings.chat.speed.normal") }</option>
                                <option className="!text-black" value={ RoomChatSettings.CHAT_SCROLL_SPEED_SLOW }>{ LocalizeText("navigator.roomsettings.chat.speed.slow") }</option>
                            </select>
                            <i className="pointer-events-none h-2 w-3 bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-269px_-23px]" />
                        </div>
                        <div className="illumina-select relative flex h-6 items-center gap-[3px] px-2.5">
                            <select className="w-full bg-transparent text-sm" value={ roomData.chatSettings.protection } onChange={ event => handleChange("flood_protection", event.target.value) }>
                                <option className="!text-black" value={ RoomChatSettings.FLOOD_FILTER_LOOSE }>{ LocalizeText("navigator.roomsettings.chat.flood.loose") }</option>
                                <option className="!text-black" value={ RoomChatSettings.FLOOD_FILTER_NORMAL }>{ LocalizeText("navigator.roomsettings.chat.flood.normal") }</option>
                                <option className="!text-black" value={ RoomChatSettings.FLOOD_FILTER_STRICT }>{ LocalizeText("navigator.roomsettings.chat.flood.strict") }</option>
                            </select>
                            <i className="pointer-events-none h-2 w-3 bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-269px_-23px]" />
                        </div>
                        <div className="flex items-center gap-1">
                            <input type="number" className="illumina-input h-[23px] w-5 p-1" min="0" value={ chatDistance } onChange={ event => setChatDistance(event.target.valueAsNumber) } onBlur={ event => handleChange("chat_distance", chatDistance) } />
                            <p className="text-sm">{ LocalizeText("navigator.roomsettings.chat_settings.hearing.distance") }</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
