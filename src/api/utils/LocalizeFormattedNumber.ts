export function LocalizeFormattedNumber(number: number): string
{
    if(!number || isNaN(number)) return '0';

    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
};
