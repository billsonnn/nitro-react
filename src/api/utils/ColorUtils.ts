export class ColorUtils
{
    public static makeColorHex(color: string): string
    {
        return ('#' + color);
    }

    public static makeColorNumberHex(color: number): string
    {
        let val = color.toString(16);
        if(val.length < 6)
        {
            const diff = 6 - val.length;
            for(let i = 0; i < diff; i++)
            {
                val = '0' + val;
            }
        }
        return ( '#' + val);
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
}
