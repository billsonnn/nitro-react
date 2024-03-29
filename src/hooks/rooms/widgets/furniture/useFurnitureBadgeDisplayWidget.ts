import { GetRoomEngine, GetSessionDataManager, RoomEngineTriggerWidgetEvent, RoomObjectVariable, StringDataType } from '@nitrots/nitro-renderer';
import { useState } from 'react';
import { LocalizeBadgeDescription, LocalizeBadgeName, LocalizeText } from '../../../../api';
import { useNitroEvent } from '../../../events';
import { useNotification } from '../../../notification';
import { useFurniRemovedEvent } from '../../engine';

const useFurnitureBadgeDisplayWidgetState = () =>
{
    const [ objectId, setObjectId ] = useState(-1);
    const [ category, setCategory ] = useState(-1);
    const [ color, setColor ] = useState('1');
    const [ badgeName, setBadgeName ] = useState('');
    const [ badgeDesc, setBadgeDesc ] = useState('');
    const [ date, setDate ] = useState('');
    const [ senderName, setSenderName ] = useState('');
    const { simpleAlert = null } = useNotification();

    const onClose = () =>
    {
        setObjectId(-1);
        setCategory(-1);
        setColor('1');
        setBadgeName('');
        setBadgeDesc('');
        setDate('');
        setSenderName('');
    }

    useNitroEvent<RoomEngineTriggerWidgetEvent>([
        RoomEngineTriggerWidgetEvent.REQUEST_BADGE_DISPLAY_ENGRAVING,
        RoomEngineTriggerWidgetEvent.REQUEST_ACHIEVEMENT_RESOLUTION_ENGRAVING
    ], event =>
    {
        const roomObject = GetRoomEngine().getRoomObject(event.roomId, event.objectId, event.category);

        if(!roomObject) return;

        const stringStuff = new StringDataType();

        stringStuff.initializeFromRoomObjectModel(roomObject.model);

        setObjectId(event.objectId);
        setCategory(event.category);
        setColor('1');
        setBadgeName(LocalizeBadgeName(stringStuff.getValue(1)));
        setBadgeDesc(LocalizeBadgeDescription(stringStuff.getValue(1)));
        setDate(stringStuff.getValue(2));
        setSenderName(stringStuff.getValue(3));
    });

    useNitroEvent<RoomEngineTriggerWidgetEvent>(RoomEngineTriggerWidgetEvent.REQUEST_ACHIEVEMENT_RESOLUTION_FAILED, event =>
    {
        const roomObject = GetRoomEngine().getRoomObject(event.roomId, event.objectId, event.category);

        if(!roomObject) return;

        const ownerId = roomObject.model.getValue<number>(RoomObjectVariable.FURNITURE_OWNER_ID);

        if(ownerId !== GetSessionDataManager().userId) return;
        
        simpleAlert(`${ LocalizeText('resolution.failed.subtitle') } ${ LocalizeText('resolution.failed.text') }`, null, null, null, LocalizeText('resolution.failed.title'));
    });

    useFurniRemovedEvent(((objectId !== -1) && (category !== -1)), event =>
    {
        if((event.id !== objectId) || (event.category !== category)) return;

        onClose();
    });

    return { objectId, category, color, badgeName, badgeDesc, date, senderName, onClose };
}

export const useFurnitureBadgeDisplayWidget = useFurnitureBadgeDisplayWidgetState;
