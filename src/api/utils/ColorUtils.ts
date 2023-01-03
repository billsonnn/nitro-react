export class ColorUtils
{
    public static makeColorHex(color: string): string
    {
        return ('#' + color);
    }

    public static makeColorNumberHex(color: number): string
    {
        let val = color.toString(16);
        return ( '#' + val.padStart(6, '0'));
    }

    public static convertFromHex(color: string): number
    {
        return parseInt(color.replace('#', ''), 16);
    }

    public static uintHexColor(color: number): string
    {
        const realColor = color >>>0;

        return ColorUtils.makeColorHex(realColor.toString(16).substring(2));
    }

    /**
     * Converts an integer format into an array of 8-bit values
     * @param {number} value value in integer format
     * @returns {Array} 8-bit values
     */
    public static int_to_8BitVals(value: number): [number, number, number, number]
    {
        const val1 = ((value >> 24) & 0xFF)
        const val2 = ((value >> 16) & 0xFF);
        const val3 = ((value >> 8) & 0xFF);
        const val4 = (value & 0xFF);

        return [ val1, val2, val3, val4 ];
    }

    /**
     * Combines 4 8-bit values into a 32-bit integer. Values are combined in
     * in the order of the parameters
     * @param val1
     * @param val2
     * @param val3
     * @param val4
     * @returns 32-bit integer of combined values
     */
    public static eight_bitVals_to_int(val1: number, val2: number, val3: number, val4: number): number
    {
        return (((val1) << 24) + ((val2) << 16) + ((val3) << 8) + (val4| 0));
    }

    public static int2rgb(color: number): string
    {
        color >>>= 0;
        const b = color & 0xFF;
        const g = (color & 0xFF00) >>> 8;
        const r = (color & 0xFF0000) >>> 16;
        const a = ((color & 0xFF000000) >>> 24) / 255;

        return 'rgba(' + [ r, g, b, 1 ].join(',') + ')';
    }
}
