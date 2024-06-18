import { RoomEngineTriggerWidgetEvent } from '@nitrots/nitro-renderer';
import { FC, useEffect, useMemo, useState } from 'react';
import ReactSlider from 'react-slider';
import { ColorUtils, FurnitureDimmerUtilities, GetConfigurationValue, LocalizeText } from '../../../../api';
import { Button, Column, Grid, NitroCardContentView, NitroCardHeaderView, NitroCardTabsItemView, NitroCardTabsView, NitroCardView, Text } from '../../../../common';
import { useFurnitureDimmerWidget, useNitroEvent } from '../../../../hooks';
import { classNames } from '../../../../layout';

export const FurnitureDimmerView: FC<{}> = props =>
{
    const [ isVisible, setIsVisible ] = useState(false);
    const { presets = [], dimmerState = 0, selectedPresetId = 0, color = 0xFFFFFF, brightness = 0xFF, effectId = 0, selectedColor = 0, setSelectedColor = null, selectedBrightness = 0, setSelectedBrightness = null, selectedEffectId = 0, setSelectedEffectId = null, selectPresetId = null, applyChanges } = useFurnitureDimmerWidget();

    const onClose = () =>
    {
        FurnitureDimmerUtilities.previewDimmer(color, brightness, (effectId === 2));

        setIsVisible(false);
    };

    useNitroEvent<RoomEngineTriggerWidgetEvent>(RoomEngineTriggerWidgetEvent.REMOVE_DIMMER, event => setIsVisible(false));

    useEffect(() =>
    {
        if(!presets || !presets.length) return;

        setIsVisible(true);
    }, [ presets ]);

    const isFreeColorMode = useMemo(() => GetConfigurationValue<boolean>('widget.dimmer.colorwheel', false), []);

    if(!isVisible) return null;

    return (
        <NitroCardView className="nitro-room-widget-dimmer">
            <NitroCardHeaderView headerText={ LocalizeText('widget.dimmer.title') } onCloseClick={ onClose } />
            { (dimmerState === 1) &&
                <NitroCardTabsView>
                    { presets.map(preset => <NitroCardTabsItemView key={ preset.id } isActive={ (selectedPresetId === preset.id) } onClick={ event => selectPresetId(preset.id) }>{ LocalizeText(`widget.dimmer.tab.${ preset.id }`) }</NitroCardTabsItemView>) }
                </NitroCardTabsView> }
            <NitroCardContentView>
                { (dimmerState === 0) &&
                    <Column alignItems="center">
                        <div className="dimmer-banner" />
                        <Text center className="p-1 rounded bg-muted">{ LocalizeText('widget.dimmer.info.off') }</Text>
                        <Button fullWidth variant="success" onClick={ () => FurnitureDimmerUtilities.changeState() }>{ LocalizeText('widget.dimmer.button.on') }</Button>
                    </Column> }
                { (dimmerState === 1) &&
                    <>
                        <div className="flex flex-col gap-1">
                            <Text fontWeight="bold">{ LocalizeText('widget.backgroundcolor.hue') }</Text>
                            { isFreeColorMode &&
                                <input className="min-h-[calc(1.5em+ .5rem+2px)] px-[.5rem] py-[.25rem]  rounded-[.2rem]" type="color" value={ ColorUtils.makeColorNumberHex(selectedColor) } onChange={ event => setSelectedColor(ColorUtils.convertFromHex(event.target.value)) } /> }
                            { !isFreeColorMode &&
                                <Grid columnCount={ 7 } gap={ 1 }>
                                    { FurnitureDimmerUtilities.AVAILABLE_COLORS.map((color, index) =>
                                    {
                                        return (
                                            <Column key={ index } fullWidth pointer className={ classNames('color-swatch rounded', ((color === selectedColor) && 'active')) } style={ { backgroundColor: FurnitureDimmerUtilities.HTML_COLORS[index] } } onClick={ () => setSelectedColor(color) } />
                                        );
                                    }) }
                                </Grid> }
                        </div>
                        <div className="flex flex-col gap-1">
                            <Text fontWeight="bold">{ LocalizeText('widget.backgroundcolor.lightness') }</Text>
                            <ReactSlider
                                className="nitro-slider"
                                max={ FurnitureDimmerUtilities.MAX_BRIGHTNESS }
                                min={ FurnitureDimmerUtilities.MIN_BRIGHTNESS }
                                renderThumb={ (props, state) => <div { ...props }>{ FurnitureDimmerUtilities.scaleBrightness(state.valueNow) }</div> }
                                thumbClassName={ 'thumb percent' }
                                value={ selectedBrightness }
                                onChange={ value => setSelectedBrightness(value) } />
                        </div>
                        <div className="flex items-center gap-1">
                            <input checked={ (selectedEffectId === 2) } className="form-check-input" type="checkbox" onChange={ event => setSelectedEffectId(event.target.checked ? 2 : 1) } />
                            <Text>{ LocalizeText('widget.dimmer.type.checkbox') }</Text>
                        </div>
                        <div className="flex gap-1">
                            <Button fullWidth variant="danger" onClick={ () => FurnitureDimmerUtilities.changeState() }>{ LocalizeText('widget.dimmer.button.off') }</Button>
                            <Button fullWidth variant="success" onClick={ applyChanges }>{ LocalizeText('widget.dimmer.button.apply') }</Button>
                        </div>
                    </> }
            </NitroCardContentView>
        </NitroCardView>
    );
};
