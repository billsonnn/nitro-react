import { ApplyTonerComposer, ColorConverter, GetRoomEngine, RoomEngineTriggerWidgetEvent, RoomObjectVariable } from '@nitrots/nitro-renderer';
import { useEffect, useState } from 'react';
import { CanManipulateFurniture, ColorUtils, DispatchUiEvent, RoomWidgetUpdateBackgroundColorPreviewEvent, SendMessageComposer } from '../../../../api';
import { useNitroEvent } from '../../../events';
import { useFurniRemovedEvent } from '../../engine';
import { useRoom } from '../../useRoom';

const useFurnitureBackgroundColorWidgetState = () =>
{
    const [ objectId, setObjectId ] = useState(-1);
    const [ category, setCategory ] = useState(-1);
    const [ color, setColor ] = useState(0);
    const { roomSession = null } = useRoom();

    const applyToner = () =>
    {
        const hsl = ColorConverter.rgbToHSL(color);
        const [ _, hue, saturation, lightness ] = ColorUtils.int_to_8BitVals(hsl);
        SendMessageComposer(new ApplyTonerComposer(objectId, hue, saturation, lightness));
    }

    const toggleToner = () => roomSession.useMultistateItem(objectId);

    const onClose = () =>
    {
        DispatchUiEvent(new RoomWidgetUpdateBackgroundColorPreviewEvent(RoomWidgetUpdateBackgroundColorPreviewEvent.CLEAR_PREVIEW));

        setObjectId(-1);
        setCategory(-1);
        setColor(0);
    }

    useNitroEvent<RoomEngineTriggerWidgetEvent>(RoomEngineTriggerWidgetEvent.REQUEST_BACKGROUND_COLOR, event =>
    {
        if(!CanManipulateFurniture(roomSession, event.objectId, event.category)) return;

        const roomObject = GetRoomEngine().getRoomObject(event.roomId, event.objectId, event.category);
        const model = roomObject.model;

        setObjectId(event.objectId);
        setCategory(event.category)
        const hue = parseInt(model.getValue<string>(RoomObjectVariable.FURNITURE_ROOM_BACKGROUND_COLOR_HUE));
        const saturation = parseInt(model.getValue<string>(RoomObjectVariable.FURNITURE_ROOM_BACKGROUND_COLOR_SATURATION));
        const light = parseInt(model.getValue<string>(RoomObjectVariable.FURNITURE_ROOM_BACKGROUND_COLOR_LIGHTNESS));

        const hsl = ColorUtils.eight_bitVals_to_int(0, hue,saturation,light);

        const rgbColor = ColorConverter.hslToRGB(hsl);
        setColor(rgbColor);
    });

    useFurniRemovedEvent(((objectId !== -1) && (category !== -1)), event =>
    {
        if((event.id !== objectId) || (event.category !== category)) return;

        onClose();
    });

    useEffect(() =>
    {
        if((objectId === -1) || (category === -1)) return;

        const hls = ColorConverter.rgbToHSL(color);
        const [ _, hue, saturation, lightness ] = ColorUtils.int_to_8BitVals(hls);
        DispatchUiEvent(new RoomWidgetUpdateBackgroundColorPreviewEvent(RoomWidgetUpdateBackgroundColorPreviewEvent.PREVIEW, hue, saturation, lightness));
    }, [ objectId, category, color ]);

    return { objectId, color, setColor, applyToner, toggleToner, onClose };
}

export const useFurnitureBackgroundColorWidget = useFurnitureBackgroundColorWidgetState;
