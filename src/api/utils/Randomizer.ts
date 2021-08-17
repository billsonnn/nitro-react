export class Randomizer
{
    public static getRandomNumber(count: number): number
    {
        return Math.floor(Math.random() * count);
    }

    public static getRandomElement<T>(elements: T[]): T
    {
        return elements[this.getRandomNumber(elements.length)];
    }

    public static getRandomElements<T>(elements: T[], count: number): T[]
    {
        const result: T[] = new Array(count);
        let len = elements.length;
        const taken = new Array(len);

        while(count--)
        {
            var x = this.getRandomNumber(len);
            result[count] = elements[x in taken ? taken[x] : x];
            taken[x] = --len in taken ? taken[len] : len;
        }

        return result;
    }
}
