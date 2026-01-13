import { RoomEngineTriggerWidgetEvent } from "@nitrots/nitro-renderer"
import { FC, useEffect, useState } from "react"
import ReactSlider from "react-slider"
import { FurnitureDimmerUtilities, LocalizeText } from "../../../../api"
import { Button, DraggableWindowPosition, NitroCardContentView, NitroCardHeaderView, NitroCardTabsItemView, NitroCardTabsView, NitroCardView } from "../../../../common"
import { useFurnitureDimmerWidget, useRoomEngineEvent } from "../../../../hooks"

export const FurnitureDimmerView: FC<{}> = props =>
{
    const [ isVisible, setIsVisible ] = useState(false)
    const { presets = [], dimmerState = 0, selectedPresetId = 0, color = 0xFFFFFF, brightness = 0xFF, effectId = 0, selectedColor = 0, setSelectedColor = null, selectedBrightness = 0, setSelectedBrightness = null, selectedEffectId = 0, setSelectedEffectId = null, selectPresetId = null, applyChanges } = useFurnitureDimmerWidget()

    const onClose = () =>
    {
        FurnitureDimmerUtilities.previewDimmer(color, brightness, (effectId === 2))

        setIsVisible(false)
    }

    useRoomEngineEvent<RoomEngineTriggerWidgetEvent>(RoomEngineTriggerWidgetEvent.REMOVE_DIMMER, event => setIsVisible(false))

    useEffect(() =>
    {
        if(!presets || !presets.length) return

        setIsVisible(true)
    }, [ presets ])

    if(!isVisible) return null

    return (
        <NitroCardView uniqueKey="dimmer" className="illumina-dimmer w-[260px]" windowPosition={ DraggableWindowPosition.TOP_LEFT }>
            <NitroCardHeaderView headerText={ LocalizeText("widget.dimmer.title") } onCloseClick={ onClose } />
            <NitroCardContentView>
                { (dimmerState === 1) &&
                <NitroCardTabsView className="!justify-start !px-0">
                    { presets.map(preset => <NitroCardTabsItemView key={ preset.id } isActive={ (selectedPresetId === preset.id) } onClick={ event => selectPresetId(preset.id) }>{ LocalizeText(`widget.dimmer.tab.${ preset.id }`) }</NitroCardTabsItemView>) }
                </NitroCardTabsView> }
                { (dimmerState === 1) &&
                    <div className="pt-[13px]">
                        <div className="flex gap-0.5">
                            { FurnitureDimmerUtilities.AVAILABLE_COLORS.map((color, index) => (
                                <Button key={ index } className={`!h-[22px] !w-[27px] !p-[5px] ${(color === selectedColor) ? "!p-1.5" : ""}`} onClick={ () => setSelectedColor(color) }>
                                    <div className={`size-full border ${(color === selectedColor) ? "!border-[#00000027]" : "border-[#A4A4A4] dark:border-black"}`} style={ { backgroundColor: FurnitureDimmerUtilities.HTML_COLORS[index] } } />
                                </Button>
                            )) }
                        </div>
                        <div className="mt-3">
                            <ReactSlider
                                className="h-[17px] w-[201px] overflow-auto bg-[url('/client-assets/images/room-widgets/dimmer/slider-spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/room-widgets/dimmer/slider-spritesheet-dark.png?v=2451779')]"
                                min={ FurnitureDimmerUtilities.MIN_BRIGHTNESS }
                                max={ FurnitureDimmerUtilities.MAX_BRIGHTNESS }
                                value={ selectedBrightness }
                                onChange={ value => setSelectedBrightness(value) }
                                renderThumb={ (props, state) => <div { ...props }>
                                    <i className="block h-[17px] w-3 cursor-pointer bg-[url('/client-assets/images/room-widgets/dimmer/slider-spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/room-widgets/dimmer/slider-spritesheet-dark.png?v=2451779')] bg-[-201px_0px]" />
                                </div> } />
                        </div>
                        <div className="mt-[7px] flex items-center gap-1.5">
                            <input id="onlyBackground" className="illumina-input" type="checkbox" checked={ (selectedEffectId === 2) } onChange={ event => setSelectedEffectId(event.target.checked ? 2 : 1) } />
                            <label htmlFor="onlyBackground" className="cursor-pointer text-sm">{ LocalizeText("widget.dimmer.type.checkbox") }</label>
                        </div>
                        <p className="mt-2 text-xs text-[#999999]">{ LocalizeText("widget.dimmer.info") }</p>
                        <div className="mt-[17px] flex items-center justify-between">
                            <Button onClick={ applyChanges }>{ LocalizeText("widget.dimmer.button.apply") }</Button>
                            <Button onClick={ () => FurnitureDimmerUtilities.changeState() }>{ LocalizeText("widget.dimmer.button.off") }</Button>
                        </div>
                    </div> }
                { (dimmerState === 0) &&
                    <div className="flex flex-col items-center">
                        <i className="h-[79px] w-14 bg-[url('/client-assets/images/room-widgets/dimmer/door.png?v=2451779')]" />
                        <div className="mt-1.5 flex flex-col">
                            <p className="text-center text-sm">{ LocalizeText("widget.dimmer.info.off") }</p>
                            <div className="mt-[17px] flex items-center justify-between">
                                <Button disabled>{ LocalizeText("widget.dimmer.button.apply") }</Button>
                                <Button onClick={ () => FurnitureDimmerUtilities.changeState() }>{ LocalizeText("widget.dimmer.button.on") }</Button>
                            </div>
                        </div>
                    </div> }
            </NitroCardContentView>
        </NitroCardView>
    )
}
