import { IRoomEngine } from '@nitrots/nitro-renderer';
import { GetNitroInstance } from '../GetNitroInstance';

export function GetRoomEngine(): IRoomEngine
{
    return GetNitroInstance().roomEngine;
}
