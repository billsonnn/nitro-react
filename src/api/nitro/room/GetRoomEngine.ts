import { IRoomEngine } from 'nitro-renderer';
import { GetNitroInstance } from '../GetNitroInstance';

export function GetRoomEngine(): IRoomEngine
{
    return GetNitroInstance().roomEngine;
}
