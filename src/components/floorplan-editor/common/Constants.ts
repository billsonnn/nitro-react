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

export const COLORMAP: object = {
    'x': '101010',
    '0': '0065ff',
    '1': '0091ff',
    '2': '00bcff',
    '3': '00e8ff',
    '4': '00ffea',
    '5': '00ffbf',
    '6': '00ff93',
    '7': '00ff68',
    '8': '00ff3d',
    '9': '19ff00',
    'a': '44ff00',
    'b': '70ff00',
    'c': '9bff00',
    'd': 'f2ff00',
    'e': 'ffe000',
    'f': 'ffb500',
    'g': 'ff8900',
    'h': 'ff5e00',
    'i': 'ff3200',
    'j': 'ff0700',
    'k': 'ff0023',
    'l': 'ff007a',
    'm': 'ff00a5',
    'n': 'ff00d1',
    'o': 'ff00fc',
    'p': 'd600ff',
    'q': 'aa00ff'
};
