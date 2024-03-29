import { RoomEngineTriggerWidgetEvent } from '@nitrots/nitro-renderer';
import { FC, useEffect, useMemo, useState } from 'react';
import ReactSlider from 'react-slider';
import { ColorUtils, FurnitureDimmerUtilities, GetConfigurationValue, LocalizeText } from '../../../../api';
import { Base, Button, Column, Flex, Grid, NitroCardContentView, NitroCardHeaderView, NitroCardTabsItemView, NitroCardTabsView, NitroCardView, Text, classNames } from '../../../../common';
import { useFurnitureDimmerWidget, useNitroEvent } from '../../../../hooks';

export const FurnitureDimmerView: FC<{}> = props =>
{
    const [ isVisible, setIsVisible ] = useState(false);
    const { presets = [], dimmerState = 0, selectedPresetId = 0, color = 0xFFFFFF, brightness = 0xFF, effectId = 0, selectedColor = 0, setSelectedColor = null, selectedBrightness = 0, setSelectedBrightness = null, selectedEffectId = 0, setSelectedEffectId = null, selectPresetId = null, applyChanges } = useFurnitureDimmerWidget();

    const onClose = () =>
    {
        FurnitureDimmerUtilities.previewDimmer(color, brightness, (effectId === 2));

        setIsVisible(false);
    }

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
                        <Base className="dimmer-banner" />
                        <Text center className="bg-muted rounded p-1">{ LocalizeText('widget.dimmer.info.off') }</Text>
                        <Button fullWidth variant="success" onClick={ () => FurnitureDimmerUtilities.changeState() }>{ LocalizeText('widget.dimmer.button.on') }</Button>
                    </Column> }
                { (dimmerState === 1) &&
                    <>
                        <Column gap={ 1 }>
                            <Text fontWeight="bold">{ LocalizeText('widget.backgroundcolor.hue') }</Text>
                            { isFreeColorMode &&
                                <input type="color" className="form-control" value={ ColorUtils.makeColorNumberHex(selectedColor) } onChange={ event => setSelectedColor(ColorUtils.convertFromHex(event.target.value)) } /> }
                            { !isFreeColorMode &&
                                <Grid gap={ 1 } columnCount={ 7 }>
                                    { FurnitureDimmerUtilities.AVAILABLE_COLORS.map((color, index) =>
                                    {
                                        return (
                                            <Column fullWidth pointer key={ index } className={ classNames('color-swatch rounded', ((color === selectedColor ) && 'active')) } onClick={ () => setSelectedColor(color) } style={ { backgroundColor: FurnitureDimmerUtilities.HTML_COLORS[index] } } />
                                        );
                                    }) }
                                </Grid> }
                        </Column>
                        <Column gap={ 1 }>
                            <Text fontWeight="bold">{ LocalizeText('widget.backgroundcolor.lightness') }</Text>
                            <ReactSlider
                                className="nitro-slider"
                                min={ FurnitureDimmerUtilities.MIN_BRIGHTNESS }
                                max={ FurnitureDimmerUtilities.MAX_BRIGHTNESS }
                                value={ selectedBrightness }
                                onChange={ value => setSelectedBrightness(value) }
                                thumbClassName={ 'thumb percent' }
                                renderThumb={ (props, state) => <div { ...props }>{ FurnitureDimmerUtilities.scaleBrightness(state.valueNow) }</div> } />
                        </Column>
                        <Flex alignItems="center" gap={ 1 }>
                            <input className="form-check-input" type="checkbox" checked={ (selectedEffectId === 2) } onChange={ event => setSelectedEffectId(event.target.checked ? 2 : 1) } />
                            <Text>{ LocalizeText('widget.dimmer.type.checkbox') }</Text>
                        </Flex>
                        <Flex gap={ 1 }>
                            <Button fullWidth variant="danger" onClick={ () => FurnitureDimmerUtilities.changeState() }>{ LocalizeText('widget.dimmer.button.off') }</Button>
                            <Button fullWidth variant="success" onClick={ applyChanges }>{ LocalizeText('widget.dimmer.button.apply') }</Button>
                        </Flex>
                    </> }
            </NitroCardContentView>
        </NitroCardView>
    );
}
