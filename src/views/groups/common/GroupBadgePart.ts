export class GroupBadgePart
{
    public static BASE: string = 'b';
    public static SYMBOL: string = 's';
    public static SYMBOL_ALT: string = 't';

    public type: string;
    public key: number;
    public color: number;
    public position: number;

    constructor(type: string)
    {
        this.type = type;
        this.key = 0;
        this.color = 0;
        this.position = 4;
    }

    public get code(): string
    {
        if(this.key === 0) return null;
        
        return this.type + (this.key < 10 ? '0' : '') + this.key + (this.color < 10 ? '0' : '') + this.color + (this.type === GroupBadgePart.BASE ? '' : this.position);
    }
}
