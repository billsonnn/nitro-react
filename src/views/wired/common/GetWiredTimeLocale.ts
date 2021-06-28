export function GetWiredTimeLocale(value: number): string
{
    const time = Math.floor((value / 2));

    if(!(value % 2)) return time.toString();

    return (time + 0.5).toString();
}
