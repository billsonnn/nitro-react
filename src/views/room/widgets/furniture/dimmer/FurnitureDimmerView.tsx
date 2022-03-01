import { NitroEvent } from '@nitrots/nitro-renderer';
import classNames from 'classnames';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import ReactSlider from 'react-slider';
import { ColorUtils, GetConfiguration, LocalizeText, RoomWidgetDimmerChangeStateMessage, RoomWidgetDimmerPreviewMessage, RoomWidgetDimmerSavePresetMessage, RoomWidgetUpdateDimmerEvent, RoomWidgetUpdateDimmerStateEvent } from '../../../../../api';
import { Base, Button, Column, Flex, Grid, Text } from '../../../../../common';
import { BatchUpdates, CreateEventDispatcherHook } from '../../../../../hooks';
import { NitroCardContentView, NitroCardHeaderView, NitroCardTabsItemView, NitroCardTabsView, NitroCardView } from '../../../../../layout';
import { useRoomContext } from '../../../context/RoomContext';
import { DimmerFurnitureWidgetPresetItem } from './DimmerFurnitureWidgetPresetItem';

const AVAILABLE_COLORS: number[] = [7665141, 21495, 15161822, 15353138, 15923281, 8581961, 0];
const HTML_COLORS: string[] = ['#74F5F5', '#0053F7', '#E759DE', '#EA4532', '#F2F851', '#82F349', '#000000'];
const MIN_BRIGHTNESS: number = 76;
const MAX_BRIGHTNESS: number = 255;

export const FurnitureDimmerView: FC<{}> = props =>
{
    const [ isVisible, setIsVisible ] = useState(false);
    const [ presets, setPresets ] = useState<DimmerFurnitureWidgetPresetItem[]>([]);
    const [ selectedPresetId, setSelectedPresetId ] = useState(0);
    const [ dimmerState, setDimmerState ] = useState(0);
    const [ lastDimmerState, setLastDimmerState ] = useState(0);
    const [ effectId, setEffectId ] = useState(0);
    const [ color, setColor ] = useState(0xFFFFFF);
    const [ brightness, setBrightness ] = useState(0xFF);
    const [ selectedEffectId, setSelectedEffectId ] = useState(0);
    const [ selectedColor, setSelectedColor ] = useState(0);
    const [ selectedBrightness, setSelectedBrightness ] = useState(0);
    const { eventDispatcher = null, widgetHandler = null } = useRoomContext();

    const onNitroEvent = useCallback((event: NitroEvent) =>
    {
        switch(event.type)
        {
            case RoomWidgetUpdateDimmerEvent.PRESETS: {
                const widgetEvent = (event as RoomWidgetUpdateDimmerEvent);

                const presets: DimmerFurnitureWidgetPresetItem[] = [];

                for(const preset of widgetEvent.presets) presets.push(new DimmerFurnitureWidgetPresetItem(preset.id, preset.type, preset.color, preset.brightness));

                BatchUpdates(() =>
                {
                    setPresets(presets);
                    setSelectedPresetId(widgetEvent.selectedPresetId);
                    setIsVisible(true);
                });
                return;
            }
            case RoomWidgetUpdateDimmerEvent.HIDE: {
                setIsVisible(false);

                return;
            }
            case RoomWidgetUpdateDimmerStateEvent.DIMMER_STATE: {
                const widgetEvent = (event as RoomWidgetUpdateDimmerStateEvent);

                BatchUpdates(() =>
                {
                    setLastDimmerState(dimmerState);
                    setDimmerState(widgetEvent.state);
                    setSelectedPresetId(widgetEvent.presetId);
                    setEffectId(widgetEvent.effectId);
                    setSelectedEffectId(widgetEvent.effectId);
                    setColor(widgetEvent.color);
                    setSelectedColor(widgetEvent.color);
                    setBrightness(widgetEvent.brightness);
                    setSelectedBrightness(widgetEvent.brightness);
                });

                return;
            }
        }
    }, [ dimmerState ]);

    CreateEventDispatcherHook(RoomWidgetUpdateDimmerEvent.PRESETS, eventDispatcher, onNitroEvent);
    CreateEventDispatcherHook(RoomWidgetUpdateDimmerEvent.HIDE, eventDispatcher, onNitroEvent);
    CreateEventDispatcherHook(RoomWidgetUpdateDimmerStateEvent.DIMMER_STATE, eventDispatcher, onNitroEvent);

    const selectPresetId = useCallback((id: number) =>
    {
        const preset = presets[(id - 1)];

        if(!preset) return;

        BatchUpdates(() =>
        {
            setSelectedPresetId(preset.id);
            setSelectedEffectId(preset.type);
            setSelectedColor(preset.color);
            setSelectedBrightness(preset.light);
        });
    }, [ presets ]);

    const close = useCallback(() =>
    {
        widgetHandler.processWidgetMessage(new RoomWidgetDimmerPreviewMessage(color, brightness, (effectId === 2)));

        setIsVisible(false);
    }, [ widgetHandler, color, brightness, effectId ]);

    const toggleState = useCallback(() =>
    {
        widgetHandler.processWidgetMessage(new RoomWidgetDimmerChangeStateMessage());
    }, [ widgetHandler ]);

    const applyChanges = useCallback(() =>
    {
        if(dimmerState === 0) return;

        const selectedPresetIndex = (selectedPresetId - 1);

        if((selectedPresetId < 1) || (selectedPresetId > presets.length)) return;

        const preset = presets[selectedPresetIndex];

        if(!preset || ((selectedEffectId === preset.type) && (selectedColor === preset.color) && (selectedBrightness === preset.light))) return;

        setPresets(prevValue =>
            {
                const newValue = [ ...prevValue ];

                newValue[selectedPresetIndex] = new DimmerFurnitureWidgetPresetItem(preset.id, selectedEffectId, selectedColor, selectedBrightness);

                return newValue;
            });

        widgetHandler.processWidgetMessage(new RoomWidgetDimmerSavePresetMessage(preset.id, selectedEffectId, selectedColor, selectedBrightness, true));
    }, [ widgetHandler, dimmerState, selectedPresetId, presets, selectedEffectId, selectedColor, selectedBrightness ]);

    const scaledBrightness = useCallback((value: number) =>
    {
        return ~~((((value - MIN_BRIGHTNESS) * (100 - 0)) / (MAX_BRIGHTNESS - MIN_BRIGHTNESS)) + 0);
    }, []);

    const isFreeColorMode = useMemo(() => GetConfiguration<boolean>('widget.dimmer.colorwheel', false), []);

    useEffect(() =>
    {
        if((dimmerState === 0) && (lastDimmerState === 0)) return;

        widgetHandler.processWidgetMessage(new RoomWidgetDimmerPreviewMessage(selectedColor, selectedBrightness, (selectedEffectId === 2)));
    }, [ widgetHandler, dimmerState, lastDimmerState, selectedColor, selectedBrightness, selectedEffectId ]);

    if(!isVisible) return null;

    return (
        <NitroCardView className="nitro-room-widget-dimmer">
            <NitroCardHeaderView headerText={ LocalizeText('widget.dimmer.title') } onCloseClick={ close } />
            { (dimmerState === 1) &&
                <NitroCardTabsView>
                    { presets.map(preset => <NitroCardTabsItemView key={ preset.id } isActive={ (selectedPresetId === preset.id) } onClick={ event => selectPresetId(preset.id) }>{ LocalizeText(`widget.dimmer.tab.${preset.id}`) }</NitroCardTabsItemView>) }
                </NitroCardTabsView> }
            <NitroCardContentView>
                { (dimmerState === 0) &&
                    <Column alignItems="center">
                        <Base className="dimmer-banner" />
                        <Text center className="bg-muted rounded p-1">{ LocalizeText('widget.dimmer.info.off') }</Text>
                        <Button fullWidth variant="success" onClick={ toggleState }>{ LocalizeText('widget.dimmer.button.on') }</Button>
                    </Column> }
                { (dimmerState === 1) &&
                    <>
                        <Column gap={ 1 }>
                            <Text fontWeight="bold">{ LocalizeText('widget.backgroundcolor.hue') }</Text>
                            { isFreeColorMode &&
                                <input type="color" className="form-control" value={ ColorUtils.makeColorNumberHex(selectedColor) } onChange={ event => setSelectedColor(ColorUtils.convertFromHex(event.target.value)) } /> }
                            { !isFreeColorMode &&
                                <Grid gap={ 1 } columnCount={ 7 }>
                                    { AVAILABLE_COLORS.map((color, index) =>
                                        {
                                            return (
                                                <Column fullWidth pointer key={ index } className={ 'color-swatch rounded' + classNames({ ' active': color === selectedColor }) } onClick={ () => setSelectedColor(color) } style={{ backgroundColor: HTML_COLORS[index] }} />
                                            );
                                        }) }
                                </Grid> }
                        </Column>
                        <Column gap={ 1 }>
                            <Text fontWeight="bold">{ LocalizeText('widget.backgroundcolor.lightness') }</Text>
                            <ReactSlider
                                className="nitro-slider"
                                min={ MIN_BRIGHTNESS }
                                max={ MAX_BRIGHTNESS }
                                value={ selectedBrightness }
                                onChange={ value => setSelectedBrightness(value) }
                                thumbClassName={ 'thumb percent' }
                                renderThumb={ (props, state) => <div {...props}>{ scaledBrightness(state.valueNow) }</div> } />
                        </Column>
                        <Flex alignItems="center" gap={ 1 }>
                            <input className="form-check-input" type="checkbox" checked={ (selectedEffectId === 2) } onChange={ event => setSelectedEffectId(event.target.checked ? 2 : 1) } />
                            <Text>{ LocalizeText('widget.dimmer.type.checkbox') }</Text>
                        </Flex>
                        <Flex gap={ 1 }>
                            <Button fullWidth variant="danger" onClick={ toggleState }>{ LocalizeText('widget.dimmer.button.off') }</Button>
                            <Button fullWidth variant="success" onClick={ applyChanges }>{ LocalizeText('widget.dimmer.button.apply') }</Button>
                        </Flex>
                    </> }
            </NitroCardContentView>
        </NitroCardView>
    );
}
