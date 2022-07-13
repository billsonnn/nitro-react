import { RoomEngineTriggerWidgetEvent, RoomObjectVariable } from '@nitrots/nitro-renderer';
import { useCallback, useState } from 'react';
import { GetRoomEngine, GetRoomSession, GetSessionDataManager, IsOwnerOfFurniture } from '../../../../api';
import { UseRoomEngineEvent } from '../../../events';
import { useFurniRemovedEvent } from '../../useFurniRemovedEvent';

const useFurnitureStickieWidgetState = () =>
{
    const [ objectId, setObjectId ] = useState(-1);
    const [ category, setCategory ] = useState(-1);
    const [ color, setColor ] = useState('0');
    const [ text, setText ] = useState('');
    const [ canModify, setCanModify ] = useState(false);

    const close = useCallback(() =>
    {
        setObjectId(-1);
        setCategory(-1);
        setColor('0');
        setText('');
        setCanModify(false);
    }, []);

    const updateColor = (newColor: string) =>
    {
        if(newColor === color) return;

        setColor(newColor);

        GetRoomEngine().modifyRoomObjectData(objectId, category, newColor, text);
    }

    const updateText = (newText: string) =>
    {
        setText(newText);

        GetRoomEngine().modifyRoomObjectData(objectId, category, color, newText);
    }

    const trash = () => GetRoomEngine().deleteRoomObject(objectId, category);

    UseRoomEngineEvent<RoomEngineTriggerWidgetEvent>(RoomEngineTriggerWidgetEvent.REQUEST_STICKIE, event =>
    {
        const roomObject = GetRoomEngine().getRoomObject(event.roomId, event.objectId, event.category);

        if(!roomObject) return;
        
        const data = roomObject.model.getValue<string>(RoomObjectVariable.FURNITURE_ITEMDATA);

        if(data.length < 6) return;

        let color: string = null;
        let text: string = null;

        if(data.indexOf(' ') > 0)
        {
            color = data.slice(0, data.indexOf(' '));
            text = data.slice((data.indexOf(' ') + 1), data.length);
        }
        else
        {
            color = data;
        }

        setObjectId(event.objectId);
        setCategory(event.category);
        setColor(color || '0');
        setText(text || '');
        setCanModify(GetRoomSession().isRoomOwner || GetSessionDataManager().isModerator || IsOwnerOfFurniture(roomObject));
    });

    useFurniRemovedEvent(((objectId !== -1) && (category !== -1)), event =>
    {
        if((event.id !== objectId) || (event.category !== category)) return;

        close();
    });

    return { objectId, color, text, canModify, updateColor, updateText, trash, close };
}

export const useFurnitureStickieWidget = useFurnitureStickieWidgetState;
