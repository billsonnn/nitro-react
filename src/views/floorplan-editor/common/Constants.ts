export const TILE_SIZE = 32;
export const MAX_NUM_TILE_PER_AXIS = 64;

export const HEIGHT_SCHEME: string = 'x0123456789abcdefghijklmnopq';

export class FloorAction
{
    public static readonly DOOR = 0;
    public static readonly UP = 1;
    public static readonly DOWN = 2;
    public static readonly SET = 3;
    public static readonly UNSET = 4;
}
