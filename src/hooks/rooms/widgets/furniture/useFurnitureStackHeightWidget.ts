import { FurnitureStackHeightComposer, FurnitureStackHeightEvent, RoomEngineTriggerWidgetEvent } from '@nitrots/nitro-renderer';
import { useCallback, useEffect, useState } from 'react';
import { CanManipulateFurniture, GetRoomEngine, GetRoomSession, SendMessageComposer } from '../../../../api';
import { UseRoomEngineEvent } from '../../../events';
import { UseMessageEventHook } from '../../../messages';
import { useFurniRemovedEvent } from '../../useFurniRemovedEvent';

const MAX_HEIGHT: number = 40;

const useFurnitureStackHeightWidgetState = () =>
{
    const [ objectId, setObjectId ] = useState(-1);
    const [ category, setCategory ] = useState(-1);
    const [ height, setHeight ] = useState(0);
    const [ pendingHeight, setPendingHeight ] = useState(-1);

    const close = useCallback(() =>
    {
        setObjectId(-1);
        setCategory(-1);
        setHeight(0);
        setPendingHeight(-1);
    }, []);

    const updateHeight = useCallback((height: number, server: boolean = false) =>
    {
        if(!height) height = 0;
        
        height = Math.abs(height);

        if(!server) ((height > MAX_HEIGHT) && (height = MAX_HEIGHT));

        setHeight(parseFloat(height.toFixed(2)));

        if(!server) setPendingHeight(height * 100);
    }, []);

    const sendUpdate = useCallback((height: number) =>
    {
        SendMessageComposer(new FurnitureStackHeightComposer(objectId, ~~(height)));
    }, [ objectId ]);

    const onFurnitureStackHeightEvent = useCallback((event: FurnitureStackHeightEvent) =>
    {
        const parser = event.getParser();

        if(objectId !== parser.furniId) return;

        updateHeight(parser.height, true);
    }, [ objectId, updateHeight ]);

    UseMessageEventHook(FurnitureStackHeightEvent, onFurnitureStackHeightEvent);

    UseRoomEngineEvent<RoomEngineTriggerWidgetEvent>(RoomEngineTriggerWidgetEvent.REQUEST_STACK_HEIGHT, event =>
    {
        if(!CanManipulateFurniture(GetRoomSession(), event.objectId, event.category)) return;

        const roomObject = GetRoomEngine().getRoomObject(event.roomId, event.objectId, event.category);

        if(!roomObject) return;

        setObjectId(event.objectId);
        setCategory(event.category);
        setHeight(roomObject.getLocation().z);
        setPendingHeight(-1);
    });

    useEffect(() =>
    {
        if((objectId === -1) || (pendingHeight === -1)) return;

        const timeout = setTimeout(() => sendUpdate(~~(pendingHeight)), 10);

        return () => clearTimeout(timeout);
    }, [ objectId, pendingHeight, sendUpdate ]);

    useFurniRemovedEvent(((objectId !== -1) && (category !== -1)), event =>
    {
        if((event.id !== objectId) || (event.category !== category)) return;

        close();
    });

    return { objectId, height, maxHeight: MAX_HEIGHT, close, updateHeight, sendUpdate };
}

export const useFurnitureStackHeightWidget = useFurnitureStackHeightWidgetState;
