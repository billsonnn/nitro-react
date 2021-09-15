import { NitroEvent, RoomEngineTriggerWidgetEvent } from '@nitrots/nitro-renderer';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import ReactSlider from 'react-slider';
import { GetConfiguration, GetRoomEngine, LocalizeText, RoomWidgetDimmerPreviewMessage, RoomWidgetDimmerSavePresetMessage, RoomWidgetDimmerUpdateEvent, RoomWidgetFurniToWidgetMessage, RoomWidgetRoomObjectUpdateEvent } from '../../../../../api';
import { RoomDimmerPreset } from '../../../../../api/nitro/room/widgets/events/RoomDimmerPreset';
import { RoomWidgetDimmerStateUpdateEvent } from '../../../../../api/nitro/room/widgets/events/RoomWidgetDimmerStateUpdateEvent';
import { RoomWidgetDimmerChangeStateMessage } from '../../../../../api/nitro/room/widgets/messages/RoomWidgetDimmerChangeStateMessage';
import { CreateEventDispatcherHook, useRoomEngineEvent } from '../../../../../hooks';
import { NitroCardContentView, NitroCardHeaderView, NitroCardTabsItemView, NitroCardTabsView, NitroCardView } from '../../../../../layout';
import { useRoomContext } from '../../../context/RoomContext';
import { FurnitureDimmerData } from './FurnitureDimmerData';

const DEFAULT_COLORS: string[] = ['#74F5F5', '#0053F7', '#E759DE', '#EA4532', '#F2F851', '#82F349', '#000000'];

export const FurnitureDimmerView: FC<{}> = props =>
{
    const { eventDispatcher = null, widgetHandler = null } = useRoomContext();
    const [ dimmerData, setDimmerData ] = useState<FurnitureDimmerData>(null);

    const [ isActive, setIsActive ] = useState<boolean>(false);
    const [ isFreeColorMode, setIsFreeColorMode ] = useState<boolean>(false);
    const [ selectedPresetId, setSelectedPresetId ] = useState<number>(-1);
    const [ presets, setPresets ] = useState<RoomDimmerPreset[]>([]);

    const [ previewColor, setPreviewColor ] = useState<string>('#000000');
    const [ previewBrightness, setPreviewBrightness ] = useState<number>(125);
    const [ previewBgOnly, setPreviewBgOnly ] = useState<boolean>(false);

    const previewColorInt = useMemo(() =>
    {
        return parseInt(previewColor.replace('#', ''), 16);
    }, [ previewColor ]);

    useEffect(() =>
    {
        if(GetConfiguration<boolean>('widget.dimmer.colorwheel')) setIsFreeColorMode(true);
    }, []);

    useEffect(() =>
    {
        if(selectedPresetId === -1 || presets.length === 0 || !isActive) return;

        const preset = presets[selectedPresetId - 1];

        if(!preset) return;

        setPreviewColor(preset.color);
        setPreviewBrightness(preset.brightness);
        setPreviewBgOnly(preset.bgOnly);
    }, [ selectedPresetId, presets ]);

    useEffect(() =>
    {
        if(!widgetHandler || selectedPresetId === -1 || !isActive) return;
        
        widgetHandler.processWidgetMessage(new RoomWidgetDimmerPreviewMessage(previewColorInt, previewBrightness, previewBgOnly));
    }, [ previewBgOnly, previewBrightness, previewColor ]);

    const onNitroEvent = useCallback((event: NitroEvent) =>
    {
        switch(event.type)
        {
            case RoomEngineTriggerWidgetEvent.REQUEST_DIMMER: {
                const widgetEvent = (event as RoomEngineTriggerWidgetEvent);
                
                const roomObject = GetRoomEngine().getRoomObject(widgetEvent.roomId, widgetEvent.objectId, widgetEvent.category);
        
                if(!roomObject) return;

                setDimmerData(new FurnitureDimmerData(widgetEvent.objectId, widgetEvent.category));
                widgetHandler.processWidgetMessage(new RoomWidgetFurniToWidgetMessage(RoomWidgetFurniToWidgetMessage.REQUEST_DIMMER, widgetEvent.objectId, widgetEvent.category, widgetEvent.roomId));
                return;
            }
            case RoomWidgetRoomObjectUpdateEvent.FURNI_REMOVED: {
                const widgetEvent = (event as RoomWidgetRoomObjectUpdateEvent);

                setDimmerData(prevState =>
                    {
                        if(!prevState || (widgetEvent.id !== prevState.objectId) || (widgetEvent.category !== prevState.category)) return prevState;

                        return null;
                    });
                return;
            }
            case RoomWidgetDimmerUpdateEvent.PRESETS: {
                const widgetEvent = (event as RoomWidgetDimmerUpdateEvent);

                setPresets(widgetEvent.presets);
                setSelectedPresetId(widgetEvent.selectedPresetId);
                return;
            }
            case RoomWidgetDimmerStateUpdateEvent.DIMMER_STATE: {
                const widgetEvent = (event as RoomWidgetDimmerStateUpdateEvent);

                setIsActive(widgetEvent.state === 1);
                return;
            }
        }
    }, [ widgetHandler ]);

    useRoomEngineEvent(RoomEngineTriggerWidgetEvent.REQUEST_DIMMER, onNitroEvent);
    CreateEventDispatcherHook(RoomWidgetRoomObjectUpdateEvent.FURNI_REMOVED, eventDispatcher, onNitroEvent);
    CreateEventDispatcherHook(RoomWidgetDimmerUpdateEvent.PRESETS, eventDispatcher, onNitroEvent);
    CreateEventDispatcherHook(RoomWidgetDimmerStateUpdateEvent.DIMMER_STATE, eventDispatcher, onNitroEvent);

    const processAction = useCallback((type: string) =>
    {
        switch(type)
        {
            case 'toggle_state':
                widgetHandler.processWidgetMessage(new RoomWidgetDimmerChangeStateMessage());
                return;
            case 'close':
                setDimmerData(null);
                return;
            case 'save':
                widgetHandler.processWidgetMessage(new RoomWidgetDimmerSavePresetMessage(selectedPresetId, previewBgOnly ? 2 : 1, previewColorInt, previewBrightness, true));
                return;
        }
    }, [ previewBgOnly, previewBrightness, previewColorInt, selectedPresetId, widgetHandler ]);

    if(!dimmerData) return null;

    return (
        <NitroCardView className="nitro-dimmer">
            <NitroCardHeaderView headerText={ LocalizeText('widget.dimmer.title') } onCloseClick={ () => processAction('close') } />
            <NitroCardContentView className="p-0">
                { !isActive && <div className="d-flex flex-column gap-2 align-items-center p-2">
                    <div className="dimmer-banner"></div>
                    <div className="bg-muted rounded p-1 text-center text-black">{ LocalizeText('widget.dimmer.info.off') }</div>
                    <button className="btn-success btn w-100" onClick={ () => processAction('toggle_state') }>{ LocalizeText('widget.dimmer.button.on') }</button>
                </div> }
                { isActive && <>
                    <NitroCardTabsView>
                        { presets.map(preset =>
                            {
                                return <NitroCardTabsItemView key={ preset.id } isActive={ selectedPresetId === preset.id } onClick={ () => setSelectedPresetId(preset.id) }>{ LocalizeText(`widget.dimmer.tab.${preset.id}`) }</NitroCardTabsItemView>
                            }) }
                    </NitroCardTabsView>
                    <div className="p-2">
                        <div className="form-group mb-2">
                            <label className="fw-bold text-black">{ LocalizeText('widget.backgroundcolor.hue') }</label>
                            { isFreeColorMode && <input type="color" className="form-control" value={ previewColor } onChange={ (e) => setPreviewColor(e.target.value) } /> }
                            { !isFreeColorMode && <div className="d-flex gap-2">
                                { DEFAULT_COLORS.map((color, index) =>
                                {
                                    return <div key={ index } className="rounded w-100 color-swatch cursor-pointer" onClick={ () => setPreviewColor(color) } style={{ backgroundColor: color }}></div>;
                                }) }
                            </div> }
                            
                        </div>
                        <div className="form-group mb-2">
                            <label className="fw-bold text-black">{ LocalizeText('widget.backgroundcolor.lightness') }</label>
                            <ReactSlider
                                className={ 'nitro-slider' }
                                min={ 75 }
                                max={ 255 }
                                value={ previewBrightness }
                                onChange={ newValue => setPreviewBrightness(newValue) }
                                thumbClassName={ 'thumb degree' }
                                renderThumb={ (props, state) => <div {...props}>{ state.valueNow - 75 }</div> } />
                        </div>
                        <div className="form-check mb-2">
                            <input className="form-check-input" type="checkbox" checked={ previewBgOnly } onChange={ (e) => setPreviewBgOnly(e.target.checked) } />
                            <label className="form-check-label text-black">{ LocalizeText('widget.dimmer.type.checkbox') }</label>
                        </div>
                        <div className="d-flex gap-2">
                            <button className="btn btn-danger w-100" onClick={ () => processAction('toggle_state') }>{ LocalizeText('widget.dimmer.button.off') }</button>
                            <button className="btn btn-success w-100" onClick={ () => processAction('save') }>{ LocalizeText('widget.dimmer.button.apply') }</button>
                        </div>
                    </div>
                </> }
            </NitroCardContentView>
        </NitroCardView>
    );
}
