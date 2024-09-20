export const TILE_SIZE = 32;
export const MAX_NUM_TILE_PER_AXIS = 64;

export const HEIGHT_SCHEME: string = 'x0123456789abcdefghijklmnopqrst';

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
    '9': '00ff11',
    'a': '19ff00',
    'b': '44ff00',
    'c': '70ff00',
    'd': '9bff00',
    'e': 'c6ff00',
    'f': 'f2ff00',
    'g': 'ffe000',
    'h': 'ffb500',
    'i': 'ff8900',
    'j': 'ff5e00',
    'k': 'ff3200',
    'l': 'ff0700',
    'm': 'ff0023',
    'n': 'ff004f',
    'o': 'ff007a',
    'p': 'ff00a5',
    'q': 'ff00d1',
    'r': 'ff00fc',
    's': 'd600ff',
    't': 'aa00ff'
};
