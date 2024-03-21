import { GetRoomEngine, HighScoreDataType, ObjectDataFactory, RoomEngineTriggerWidgetEvent, RoomObjectVariable } from '@nitrots/nitro-renderer';
import { useState } from 'react';
import { useNitroEvent } from '../../../events';
import { useRoom } from '../../useRoom';

const SCORE_TYPES = [ 'perteam', 'mostwins', 'classic' ];
const CLEAR_TYPES = [ 'alltime', 'daily', 'weekly', 'monthly' ];

const useFurnitureHighScoreWidgetState = () =>
{
    const [ stuffDatas, setStuffDatas ] = useState<Map<number, HighScoreDataType>>(new Map());
    const { roomSession = null } = useRoom();

    const getScoreType = (type: number) => SCORE_TYPES[type];
    const getClearType = (type: number) => CLEAR_TYPES[type];

    useNitroEvent<RoomEngineTriggerWidgetEvent>(RoomEngineTriggerWidgetEvent.REQUEST_HIGH_SCORE_DISPLAY, event =>
    {
        const roomObject = GetRoomEngine().getRoomObject(event.roomId, event.objectId, event.category);
    
        if(!roomObject) return;

        const formatKey = roomObject.model.getValue<number>(RoomObjectVariable.FURNITURE_DATA_FORMAT);
        const stuffData = (ObjectDataFactory.getData(formatKey) as HighScoreDataType);

        stuffData.initializeFromRoomObjectModel(roomObject.model);

        setStuffDatas(prevValue =>
        {
            const newValue = new Map(prevValue);

            newValue.set(roomObject.id, stuffData);

            return newValue;
        });
    });

    useNitroEvent<RoomEngineTriggerWidgetEvent>(RoomEngineTriggerWidgetEvent.REQUEST_HIDE_HIGH_SCORE_DISPLAY, event =>
    {
        if(event.roomId !== roomSession.roomId) return;

        setStuffDatas(prevValue =>
        {
            const newValue = new Map(prevValue);

            newValue.delete(event.objectId);

            return newValue;
        });
    });

    return { stuffDatas, getScoreType, getClearType };
}

export const useFurnitureHighScoreWidget = useFurnitureHighScoreWidgetState;
