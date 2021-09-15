export class ColorUtils
{
    public static makeColorHex(color: string): string
    {
        return ('#' + color);
    }

    public static makeColorNumberHex(color: number): string
    {
        return ( '#' + color.toString(16));
    }

    public static convertFromHex(color: string): number
    {
        return parseInt(color.replace('#', ''), 16);
    }
}
