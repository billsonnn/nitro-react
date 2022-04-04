import { RoomSessionDoorbellEvent } from '@nitrots/nitro-renderer';
import { useCallback, useState } from 'react';
import { GetRoomSession } from '../../../api';
import { UseRoomSessionManagerEvent } from '../../events';

const useDoorbellWidgetState = () =>
{
    const [ users, setUsers ] = useState<string[]>([]);

    const addUser = useCallback((userName: string) =>
    {
        if(users.indexOf(userName) >= 0) return;

        setUsers([ ...users, userName ]);
    }, [ users ]);

    const removeUser = useCallback((userName: string) =>
    {
        const index = users.indexOf(userName);

        if(index === -1) return;

        const newUsers = [ ...users ];

        newUsers.splice(index, 1);

        setUsers(newUsers);
    }, [ users ]);

    const answer = useCallback((userName: string, flag: boolean) =>
    {
        GetRoomSession().sendDoorbellApprovalMessage(userName, flag);

        removeUser(userName);
    }, [ removeUser ]);

    const onRoomSessionDoorbellEvent = useCallback((event: RoomSessionDoorbellEvent) =>
    {
        switch(event.type)
        {
            case RoomSessionDoorbellEvent.DOORBELL:
                addUser(event.userName);
                return;
            case RoomSessionDoorbellEvent.RSDE_REJECTED:
            case RoomSessionDoorbellEvent.RSDE_ACCEPTED:
                removeUser(event.userName);
                return;
        }
    }, [ addUser, removeUser ]);

    UseRoomSessionManagerEvent(RoomSessionDoorbellEvent.DOORBELL, onRoomSessionDoorbellEvent);
    UseRoomSessionManagerEvent(RoomSessionDoorbellEvent.RSDE_REJECTED, onRoomSessionDoorbellEvent);
    UseRoomSessionManagerEvent(RoomSessionDoorbellEvent.RSDE_ACCEPTED, onRoomSessionDoorbellEvent);

    return { users, addUser, removeUser, answer };
}

export const useDoorbellWidget = useDoorbellWidgetState;
