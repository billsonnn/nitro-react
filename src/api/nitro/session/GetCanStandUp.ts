import { AvatarAction, RoomObjectVariable } from '@nitrots/nitro-renderer';
import { GetOwnRoomObject } from '../room';

export function GetCanStandUp(): string
{
    const roomObject = GetOwnRoomObject();

    if(!roomObject) return AvatarAction.POSTURE_STAND;

    const model = roomObject.model;

    return model.getValue<string>(RoomObjectVariable.FIGURE_CAN_STAND_UP);
}
