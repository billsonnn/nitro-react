import { RoomEngineTriggerWidgetEvent, RoomObjectVariable } from '@nitrots/nitro-renderer';
import { useState } from 'react';
import { GetRoomEngine } from '../../../../api';
import { useRoomEngineEvent } from '../../../events';
import { useFurniRemovedEvent } from '../../engine';

const useFurnitureTrophyWidgetState = () =>
{
    const [ objectId, setObjectId ] = useState(-1);
    const [ category, setCategory ] = useState(-1);
    const [ color, setColor ] = useState('1');
    const [ senderName, setSenderName ] = useState('');
    const [ date, setDate ] = useState('');
    const [ message, setMessage ] = useState('');

    const onClose = () =>
    {
        setObjectId(-1);
        setCategory(-1);
        setColor('1');
        setSenderName('');
        setDate('');
        setMessage('');
    }

    useRoomEngineEvent<RoomEngineTriggerWidgetEvent>(RoomEngineTriggerWidgetEvent.REQUEST_TROPHY, event =>
    {
        const roomObject = GetRoomEngine().getRoomObject(event.roomId, event.objectId, event.category);

        if(!roomObject) return;

        let data = roomObject.model.getValue<string>(RoomObjectVariable.FURNITURE_DATA);
        let extra = roomObject.model.getValue<string>(RoomObjectVariable.FURNITURE_EXTRAS);

        if(!extra) extra = '0';

        setObjectId(event.objectId);
        setCategory(event.category);
        setColor(roomObject.model.getValue<string>(RoomObjectVariable.FURNITURE_COLOR) || '1');

        const senderName = data.substring(0, data.indexOf('\t'));

        data = data.substring((senderName.length + 1), data.length);

        const trophyDate = data.substring(0, data.indexOf('\t'));
        const trophyText = data.substr((trophyDate.length + 1), data.length);

        setSenderName(senderName);
        setDate(trophyDate);
        setMessage(trophyText);
    });

    useFurniRemovedEvent(((objectId !== -1) && (category !== -1)), event =>
    {
        if((event.id !== objectId) || (event.category !== category)) return;

        onClose();
    });

    return { objectId, color, senderName, date, message, onClose };
}

export const useFurnitureTrophyWidget = useFurnitureTrophyWidgetState;
