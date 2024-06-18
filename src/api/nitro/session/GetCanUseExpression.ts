import { RoomObjectVariable } from '@nitrots/nitro-renderer';
import { GetOwnRoomObject } from '../room';

export function GetCanUseExpression(): boolean
{
    const roomObject = GetOwnRoomObject();

    if(!roomObject) return false;

    const model = roomObject.model;
    const effectId = model.getValue<number>(RoomObjectVariable.FIGURE_EFFECT);

    return !((effectId === 29) || (effectId === 30) || (effectId === 185));
}
