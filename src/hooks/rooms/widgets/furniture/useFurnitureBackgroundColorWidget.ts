import { ApplyTonerComposer, RoomEngineTriggerWidgetEvent, RoomObjectVariable } from '@nitrots/nitro-renderer';
import { useCallback, useEffect, useState } from 'react';
import { CanManipulateFurniture, GetRoomEngine, RoomWidgetUpdateBackgroundColorPreviewEvent, SendMessageComposer } from '../../../../api';
import { UseRoomEngineEvent } from '../../../events';
import { useFurniRemovedEvent } from '../../useFurniRemovedEvent';
import { useRoom } from '../../useRoom';

const useFurnitureBackgroundColorWidgetState = () =>
{
    const [ objectId, setObjectId ] = useState(-1);
    const [ category, setCategory ] = useState(-1);
    const [ hue, setHue ] = useState(0);
    const [ saturation, setSaturation ] = useState(0);
    const [ lightness, setLightness ] = useState(0);
    const { roomSession = null, widgetHandler = null } = useRoom();

    const applyToner = () => SendMessageComposer(new ApplyTonerComposer(objectId, hue, saturation, lightness));
    const toggleToner = () => roomSession.useMultistateItem(objectId);

    const close = useCallback(() =>
    {
        widgetHandler.eventDispatcher.dispatchEvent(new RoomWidgetUpdateBackgroundColorPreviewEvent(RoomWidgetUpdateBackgroundColorPreviewEvent.CLEAR_PREVIEW));

        setObjectId(-1);
        setCategory(-1);
        setHue(0);
        setSaturation(0);
        setLightness(0);
    }, [ widgetHandler ]);

    UseRoomEngineEvent<RoomEngineTriggerWidgetEvent>(RoomEngineTriggerWidgetEvent.REQUEST_BACKGROUND_COLOR, event =>
    {
        if(!CanManipulateFurniture(roomSession, event.objectId, event.category)) return;
                
        const roomObject = GetRoomEngine().getRoomObject(event.roomId, event.objectId, event.category);
        const model = roomObject.model;

        setObjectId(event.objectId);
        setCategory(event.category)
        setHue(parseInt(model.getValue<string>(RoomObjectVariable.FURNITURE_ROOM_BACKGROUND_COLOR_HUE)));
        setSaturation(parseInt(model.getValue<string>(RoomObjectVariable.FURNITURE_ROOM_BACKGROUND_COLOR_SATURATION)));
        setLightness(parseInt(model.getValue<string>(RoomObjectVariable.FURNITURE_ROOM_BACKGROUND_COLOR_LIGHTNESS)));
    });

    useFurniRemovedEvent(((objectId !== -1) && (category !== -1)), event =>
    {
        if((event.id !== objectId) || (event.category !== category)) return;

        close();
    });

    useEffect(() =>
    {
        if((objectId === -1) || (category === -1)) return;

        widgetHandler.eventDispatcher.dispatchEvent(new RoomWidgetUpdateBackgroundColorPreviewEvent(RoomWidgetUpdateBackgroundColorPreviewEvent.PREVIEW, hue, saturation, lightness));
    }, [ objectId, category, widgetHandler, hue, saturation, lightness ]);

    return { objectId, hue, setHue, saturation, setSaturation, lightness, setLightness, applyToner, toggleToner, close };
}

export const useFurnitureBackgroundColorWidget = useFurnitureBackgroundColorWidgetState;
