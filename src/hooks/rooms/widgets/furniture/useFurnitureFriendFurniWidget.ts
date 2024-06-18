import { FriendFurniConfirmLockMessageComposer, GetRoomEngine, LoveLockFurniFinishedEvent, LoveLockFurniFriendConfirmedEvent, LoveLockFurniStartEvent, RoomEngineTriggerWidgetEvent, RoomObjectVariable } from '@nitrots/nitro-renderer';
import { useState } from 'react';
import { SendMessageComposer } from '../../../../api';
import { useMessageEvent, useNitroEvent } from '../../../events';
import { useFurniRemovedEvent } from '../../engine';

const useFurnitureFriendFurniWidgetState = () =>
{
    const [ objectId, setObjectId ] = useState(-1);
    const [ category, setCategory ] = useState(-1);
    const [ type, setType ] = useState(0);
    const [ usernames, setUsernames ] = useState<string[]>([]);
    const [ figures, setFigures ] = useState<string[]>([]);
    const [ date, setDate ] = useState<string>(null);
    const [ stage, setStage ] = useState(0);

    const onClose = () =>
    {
        setObjectId(-1);
        setCategory(-1);
        setType(0);
        setUsernames([]);
        setFigures([]);
        setDate(null);
    };

    const respond = (flag: boolean) =>
    {
        SendMessageComposer(new FriendFurniConfirmLockMessageComposer(objectId, flag));

        onClose();
    };

    useMessageEvent<LoveLockFurniStartEvent>(LoveLockFurniStartEvent, event =>
    {
        const parser = event.getParser();

        setObjectId(parser.furniId);
        setStage(parser.start ? 1 : 2);
    });

    useMessageEvent<LoveLockFurniFinishedEvent>(LoveLockFurniFinishedEvent, event => onClose());
    useMessageEvent<LoveLockFurniFriendConfirmedEvent>(LoveLockFurniFriendConfirmedEvent, event => onClose());

    useNitroEvent<RoomEngineTriggerWidgetEvent>(RoomEngineTriggerWidgetEvent.REQUEST_FRIEND_FURNITURE_ENGRAVING, event =>
    {
        const roomObject = GetRoomEngine().getRoomObject(event.roomId, event.objectId, event.category);

        if(!roomObject) return;

        const data = roomObject.model.getValue<string[]>(RoomObjectVariable.FURNITURE_DATA);
        const type = roomObject.model.getValue<number>(RoomObjectVariable.FURNITURE_FRIENDFURNI_ENGRAVING);

        if((data[0] !== '1') || (data.length !== 6)) return;

        setObjectId(event.objectId);
        setCategory(event.category);
        setType(type);
        setUsernames([ data[1], data[2] ]);
        setFigures([ data[3], data[4] ]);
        setDate(data[5]);
        setStage(0);
    });

    useFurniRemovedEvent(((objectId !== -1) && (category !== -1)), event =>
    {
        if((event.id !== objectId) || (event.category !== category)) return;

        onClose();
    });

    return { objectId, type, usernames, figures, date, stage, onClose, respond };
};

export const useFurnitureFriendFurniWidget = useFurnitureFriendFurniWidgetState;
