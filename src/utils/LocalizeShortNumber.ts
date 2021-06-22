export function LocalizeShortNumber(number: number): string
{
    if(!number || isNaN(number)) return '0';

    let abs = Math.abs(number);

    const rounder = Math.pow(10, 1);
    const isNegative = (number < 0);

    let key = '';

    const powers = [
        { key: 'Q', value: Math.pow(10, 15) },
        { key: 'T', value: Math.pow(10, 12) },
        { key: 'B', value: Math.pow(10, 9) },
        { key: 'M', value: Math.pow(10, 6) },
        { key: 'K', value: 1000 }
    ];

    for(const power of powers)
    {
        let reduced = abs / power.value;

        reduced = Math.round(reduced * rounder) / rounder;

        if(reduced >= 1)
        {
            abs = reduced;
            key = power.key;

            break;
        }
    }

    return ((isNegative ? '-' : '') + abs + key);
}
