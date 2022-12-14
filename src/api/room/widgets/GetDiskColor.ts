const DISK_COLOR_RED_MIN: number = 130;
const DISK_COLOR_RED_RANGE: number = 100;
const DISK_COLOR_GREEN_MIN: number = 130;
const DISK_COLOR_GREEN_RANGE: number = 100;
const DISK_COLOR_BLUE_MIN: number = 130;
const DISK_COLOR_BLUE_RANGE: number = 100;

export const GetDiskColor = (name: string) =>
{
    let r: number = 0;
    let g: number = 0;
    let b: number = 0;
    let index: number = 0;

    while (index < name.length)
    {
        switch ((index % 3))
        {
            case 0:
                r = (r + ( name.charCodeAt(index) * 37) );
                break;
            case 1:
                g = (g + ( name.charCodeAt(index) * 37) );
                break;
            case 2:
                b = (b + ( name.charCodeAt(index) * 37) );
                break;
        }
        index++;
    }

    r = ((r % DISK_COLOR_RED_RANGE) + DISK_COLOR_RED_MIN);
    g = ((g % DISK_COLOR_GREEN_RANGE) + DISK_COLOR_GREEN_MIN);
    b = ((b % DISK_COLOR_BLUE_RANGE) + DISK_COLOR_BLUE_MIN);

    return `rgb(${ r },${ g },${ b })`;
}
