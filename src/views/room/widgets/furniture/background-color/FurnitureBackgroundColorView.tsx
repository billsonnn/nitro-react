import { ApplyTonerComposer, RoomControllerLevel, RoomEngineObjectEvent, RoomEngineTriggerWidgetEvent, RoomObjectVariable } from '@nitrots/nitro-renderer';
import { FC, useCallback, useEffect, useState } from 'react';
import ReactSlider from 'react-slider';
import { GetRoomEngine, GetSessionDataManager, LocalizeText, RoomWidgetUpdateBackgroundColorPreviewEvent, RoomWidgetUpdateRoomObjectEvent } from '../../../../../api';
import { Button, Column, Text } from '../../../../../common';
import { BatchUpdates, SendMessageHook } from '../../../../../hooks';
import { CreateEventDispatcherHook, useRoomEngineEvent } from '../../../../../hooks/events';
import { NitroCardContentView, NitroCardHeaderView, NitroCardView } from '../../../../../layout';
import { useRoomContext } from '../../../context/RoomContext';

export const FurnitureBackgroundColorView: FC<{}> = props =>
{
    const [ objectId, setObjectId ] = useState(-1);
    const [ hue, setHue ] = useState(0);
    const [ saturation, setSaturation ] = useState(0);
    const [ lightness, setLightness ] = useState(0);
    const { roomSession = null, eventDispatcher = null } = useRoomContext();

    const close = useCallback(() =>
    {
        eventDispatcher.dispatchEvent(new RoomWidgetUpdateBackgroundColorPreviewEvent(RoomWidgetUpdateBackgroundColorPreviewEvent.CLEAR_PREVIEW));

        setObjectId(-1);
    }, [ eventDispatcher ]);

    const canOpenBackgroundToner = useCallback(() =>
    {
        const isRoomOwner = roomSession.isRoomOwner;
        const hasLevel = (roomSession.controllerLevel >= RoomControllerLevel.GUEST);
        const isGodMode = GetSessionDataManager().isGodMode;

        return (isRoomOwner || hasLevel || isGodMode);
    }, [ roomSession ]);

    const onRoomEngineObjectEvent = useCallback((event: RoomEngineObjectEvent) =>
    {
        switch(event.type)
        {
            case RoomEngineTriggerWidgetEvent.REQUEST_BACKGROUND_COLOR: {
                if(!canOpenBackgroundToner()) return;
                
                const roomObject = GetRoomEngine().getRoomObject(event.roomId, event.objectId, event.category);
                const model = roomObject.model;

                BatchUpdates(() =>
                {
                    setObjectId(roomObject.id);
                    setHue(parseInt(model.getValue<string>(RoomObjectVariable.FURNITURE_ROOM_BACKGROUND_COLOR_HUE)));
                    setSaturation(parseInt(model.getValue<string>(RoomObjectVariable.FURNITURE_ROOM_BACKGROUND_COLOR_SATURATION)));
                    setLightness(parseInt(model.getValue<string>(RoomObjectVariable.FURNITURE_ROOM_BACKGROUND_COLOR_LIGHTNESS)));
                });
                
                return;
            }
            case RoomWidgetUpdateRoomObjectEvent.FURNI_REMOVED: {
                if(objectId !== event.objectId) return;

                close();
                return;
            }
        }
    }, [ objectId, canOpenBackgroundToner, close ]);

    useRoomEngineEvent(RoomEngineTriggerWidgetEvent.REQUEST_BACKGROUND_COLOR, onRoomEngineObjectEvent);
    CreateEventDispatcherHook(RoomWidgetUpdateRoomObjectEvent.FURNI_REMOVED, eventDispatcher, onRoomEngineObjectEvent);

    const processAction = useCallback((name: string) =>
    {
        switch(name)
        {
            case 'apply':
                SendMessageHook(new ApplyTonerComposer(objectId, hue, saturation, lightness));
                break;
            case 'toggle':
                roomSession.useMultistateItem(objectId);
                break;
        }
    }, [ roomSession, objectId, hue, saturation, lightness ]);

    useEffect(() =>
    {
        if(objectId === -1) return;
        
        eventDispatcher.dispatchEvent(new RoomWidgetUpdateBackgroundColorPreviewEvent(RoomWidgetUpdateBackgroundColorPreviewEvent.PREVIEW, hue, saturation, lightness));
    }, [ eventDispatcher, objectId, hue, saturation, lightness ]);

    if(objectId === -1) return null;

    return (
        <NitroCardView>
            <NitroCardHeaderView headerText={ LocalizeText('widget.backgroundcolor.title') } onCloseClick={ close } />
            <NitroCardContentView overflow="hidden" justifyContent="between">
                <Column overflow="auto" gap={ 1 }>
                    <Column>
                        <Text bold>{ LocalizeText('widget.backgroundcolor.hue') }</Text>
                        <ReactSlider
                            className={ 'nitro-slider' }
                            min={ 0 }
                            max={ 360 }
                            value={ hue }
                            onChange={ event => setHue(event) }
                            thumbClassName={ 'thumb degree' }
                            renderThumb={ (props, state) => <div { ...props }>{ state.valueNow }</div> } />
                    </Column>
                    <Column>
                        <Text bold>{ LocalizeText('widget.backgroundcolor.saturation') }</Text>
                        <ReactSlider
                            className={ 'nitro-slider' }
                            min={ 0 }
                            max={ 100 }
                            value={ saturation }
                            onChange={ event => setSaturation(event) }
                            thumbClassName={ 'thumb percent' }
                            renderThumb={ (props, state) => <div { ...props }>{ state.valueNow }</div> } />
                    </Column>
                    <Column>
                        <Text bold>{ LocalizeText('widget.backgroundcolor.lightness') }</Text>
                        <ReactSlider
                            className={ 'nitro-slider' }
                            min={ 0 }
                            max={ 100 }
                            value={ lightness }
                            onChange={ event => setLightness(event) }
                            thumbClassName={ 'thumb percent' }
                            renderThumb={ (props, state) => <div { ...props }>{ state.valueNow }</div> } />
                    </Column>
                </Column>
                <Column gap={ 1 }>
                    <Button fullWidth variant="primary" onClick={ event => processAction('toggle') }>
                        { LocalizeText('widget.backgroundcolor.button.on') }
                    </Button>
                    <Button fullWidth variant="primary" onClick={ event => processAction('apply') }>
                        { LocalizeText('widget.backgroundcolor.button.apply') }
                    </Button>
                </Column>
            </NitroCardContentView>
        </NitroCardView>
    );
}
