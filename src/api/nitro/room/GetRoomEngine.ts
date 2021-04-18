import { IRoomEngine, Nitro } from 'nitro-renderer';

export function GetRoomEngine(): IRoomEngine
{
    return Nitro.instance.roomEngine;
}
