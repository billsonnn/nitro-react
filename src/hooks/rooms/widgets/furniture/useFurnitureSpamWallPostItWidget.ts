import { AddSpamWallPostItMessageComposer, RequestSpamWallPostItMessageEvent, RoomObjectCategory } from '@nitrots/nitro-renderer';
import { useState } from 'react';
import { GetRoomEngine, SendMessageComposer } from '../../../../api';
import { useMessageEvent } from '../../../events';
import { useInventoryFurni } from '../../../inventory';

const useFurnitureSpamWallPostItWidgetState = () =>
{
    const [ objectId, setObjectId ] = useState(-1);
    const [ category, setCategory ] = useState(-1);
    const [ itemType, setItemType ] = useState('');
    const [ location, setLocation ] = useState('');
    const [ color, setColor ] = useState('0');
    const [ text, setText ] = useState('');
    const [ canModify, setCanModify ] = useState(false);
    const { getWallItemById = null } = useInventoryFurni();

    const onClose = () =>
    {
        SendMessageComposer(new AddSpamWallPostItMessageComposer(objectId, location, color, text));

        setObjectId(-1);
        setCategory(-1);
        setItemType('');
        setLocation('');
        setColor('0');
        setText('');
        setCanModify(false);
    }

    useMessageEvent<RequestSpamWallPostItMessageEvent>(RequestSpamWallPostItMessageEvent, event =>
    {
        const parser = event.getParser();
        
        setObjectId(parser.itemId);
        setCategory(RoomObjectCategory.WALL);

        const inventoryItem = getWallItemById(parser.itemId);

        let itemType = 'post_it';

        if(inventoryItem)
        {
            const wallItemType = GetRoomEngine().getFurnitureWallName(inventoryItem.type);

            if(wallItemType.match('post_it_')) itemType = wallItemType;
        }

        setItemType(itemType);
        setLocation(parser.location);
        setColor('FFFF33');
        setText('');
        setCanModify(true);
    });

    return { objectId, color, setColor, text, setText, canModify, onClose };
}

export const useFurnitureSpamWallPostItWidget = useFurnitureSpamWallPostItWidgetState;
