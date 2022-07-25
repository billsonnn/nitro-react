import { RoomSessionDoorbellEvent } from '@nitrots/nitro-renderer';
import { useState } from 'react';
import { GetRoomSession } from '../../../api';
import { useRoomSessionManagerEvent } from '../../events';

const useDoorbellWidgetState = () =>
{
    const [ users, setUsers ] = useState<string[]>([]);

    const addUser = (userName: string) =>
    {
        if(users.indexOf(userName) >= 0) return;

        setUsers([ ...users, userName ]);
    }

    const removeUser = (userName: string) =>
    {
        const index = users.indexOf(userName);

        if(index === -1) return;

        const newUsers = [ ...users ];

        newUsers.splice(index, 1);

        setUsers(newUsers);
    }

    const answer = (userName: string, flag: boolean) =>
    {
        GetRoomSession().sendDoorbellApprovalMessage(userName, flag);

        removeUser(userName);
    }

    useRoomSessionManagerEvent<RoomSessionDoorbellEvent>(RoomSessionDoorbellEvent.DOORBELL, event => addUser(event.userName));
    useRoomSessionManagerEvent<RoomSessionDoorbellEvent>(RoomSessionDoorbellEvent.RSDE_REJECTED, event => removeUser(event.userName));
    useRoomSessionManagerEvent<RoomSessionDoorbellEvent>(RoomSessionDoorbellEvent.RSDE_ACCEPTED, event => removeUser(event.userName));

    return { users, addUser, removeUser, answer };
}

export const useDoorbellWidget = useDoorbellWidgetState;
