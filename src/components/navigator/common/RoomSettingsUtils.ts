export function GetMaxVisitorsList(): number[]
{
    const list: number[] = [];

    for(let i = 10; i <= 100; i = i + 10)
    {
        list.push(i);
    }

    return list;
}
