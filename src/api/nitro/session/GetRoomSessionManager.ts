import { IRoomSessionManager, Nitro } from 'nitro-renderer';

export function GetRoomSessionManager(): IRoomSessionManager
{
    return Nitro.instance.roomSessionManager;
}
