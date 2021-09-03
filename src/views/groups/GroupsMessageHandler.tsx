import { GroupBadgePartsEvent, GroupBuyDataEvent, RoomCreatedEvent } from '@nitrots/nitro-renderer';
import { FC, useCallback } from 'react';
import { CreateMessageHook } from '../../hooks';
import { useGroupsContext } from './context/GroupsContext';
import { GroupsActions } from './context/GroupsContext.types';

function compareId(a, b)
{
    if( a.id < b.id ) return -1;
    if( a.id > b.id ) return 1;
    return 0;
}

export const GroupsMessageHandler: FC<{}> = props =>
{
    const { groupsState = null, dispatchGroupsState = null } = useGroupsContext();
    const { availableRooms = null } = groupsState;

    const onGroupBuyDataEvent = useCallback((event: GroupBuyDataEvent) =>
    {
        const parser = event.getParser();

        const rooms: { id: number, name: string }[] = [];

        parser.availableRooms.forEach((name, id) =>
        {
            rooms.push({ id, name });
        });

        dispatchGroupsState({
            type: GroupsActions.SET_PURHCASE_SETTINGS,
            payload: {
                objectArrays: rooms,
                numberValue: parser.groupCost
            }
        });
    }, [ dispatchGroupsState ]);


    const onRoomCreatedEvent = useCallback((event: RoomCreatedEvent) =>
    {
        const parser = event.getParser();

        const clonedRooms = Array.from(availableRooms);
        clonedRooms.push({
            id: parser.roomId,
            name: parser.roomName
        });

        dispatchGroupsState({
            type: GroupsActions.SET_PURHCASE_SETTINGS,
            payload: {
                objectArrays: clonedRooms
            }
        });
    }, []);


    const onGroupBadgePartsEvent = useCallback((event: GroupBadgePartsEvent) =>
    {
        const parser = event.getParser();

        const bases: { id: number, images: string[] }[] = [];
        const symbols: { id: number, images: string[] }[] = [];
        const partColors: { id: number, color: string }[] = [];
        const colorsA: { id: number, color: string }[] = [];
        const colorsB: { id: number, color: string }[] = [];

        parser.bases.forEach((images, id) =>
        {
            bases.push({ id, images });
        });

        parser.symbols.forEach((images, id) =>
        {
            symbols.push({ id, images });
        });

        parser.partColors.forEach((color, id) =>
        {
            partColors.push({ id, color });
        });

        parser.colorsA.forEach((color, id) =>
        {
            colorsA.push({ id, color });
        });

        parser.colorsB.forEach((color, id) =>
        {
            colorsB.push({ id, color });
        });

        bases.sort(compareId);
        symbols.sort(compareId);
        partColors.sort(compareId);
        colorsA.sort(compareId);
        colorsB.sort(compareId);

        dispatchGroupsState({
            type: GroupsActions.SET_GROUP_BADGE_PARTS_CONFIG,
            payload: {
                objectArrays: [ bases, symbols, partColors, colorsA, colorsB ]
            }
        })
    }, [ dispatchGroupsState ]);

    CreateMessageHook(GroupBuyDataEvent, onGroupBuyDataEvent);
    CreateMessageHook(RoomCreatedEvent, onRoomCreatedEvent);
    CreateMessageHook(GroupBadgePartsEvent, onGroupBadgePartsEvent);

    return null;
};
