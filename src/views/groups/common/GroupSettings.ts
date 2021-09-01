import { GroupBadgePart } from './GroupBadgePart';

export class GroupSettings
{
    private _id: number;
    private _name: string;
    private _description: string;
    private _roomId: string;

    private _badgeParts: GroupBadgePart[];
    private _colorA: number;
    private _colorB: number;

    private _state: number;
    private _canMembersDecorate: boolean;
    
    constructor()
    {
        this._id                    = 0;
        this._name                  = '';
        this._description           = '';
        this._roomId                = '0';

        this._badgeParts            = [];
        this._colorA                = 0;
        this.colorB                 = 0;
        
        this._state                 = 0;
        this._canMembersDecorate    = false;

        this._badgeParts.push(new GroupBadgePart(GroupBadgePart.BASE));
        this._badgeParts.push(new GroupBadgePart(GroupBadgePart.SYMBOL));
        this._badgeParts.push(new GroupBadgePart(GroupBadgePart.SYMBOL));
        this._badgeParts.push(new GroupBadgePart(GroupBadgePart.SYMBOL));
        this._badgeParts.push(new GroupBadgePart(GroupBadgePart.SYMBOL));
    }

    public getBadgePart(index: number): GroupBadgePart
    {
        return this._badgeParts[index];
    }

    public setPartsColor(color: number): void
    {
        this._badgeParts.forEach((symbol) =>
        {
            symbol.color = color;
        });
    }

    public get id(): number
    {
        return this._id;
    }

    public set id(id: number)
    {
        this._id = id;
    }

    public get name(): string
    {
        return this._name;
    }

    public set name(name: string)
    {
        this._name = name;
    }

    public get description(): string
    {
        return this._description;
    }

    public set description(description: string)
    {
        this._description = description;
    }

    public get roomId(): string
    {
        return this._roomId;
    }

    public set roomId(id: string)
    {
        this._roomId = id;
    }

    public get badgeParts(): GroupBadgePart[]
    {
        return this._badgeParts;
    }

    public set badgeParts(parts: GroupBadgePart[])
    {
        this._badgeParts = parts;
    }

    public get colorA(): number
    {
        return this._colorA;
    }

    public set colorA(id: number)
    {
        this._colorA = id;
    }

    public get colorB(): number
    {
        return this._colorB;
    }

    public set colorB(id: number)
    {
        this._colorB = id;
    }

    public get currentBadgeCode(): string
    {
        let code = '';

        this._badgeParts.forEach((part) =>
        {
            if(part.code)
            {
                code = code + part.code;
            }
        });

        return code;
    }

    public get currentBadgeArray(): number[]
    {
        const badge = [];

        this._badgeParts.forEach((part) =>
        {
            if(part.code)
            {
                badge.push(part.key);
                badge.push(part.color);
                badge.push(part.position);
            }
        });

        return badge;
    }

    public get state(): number
    {
        return this._state;
    }

    public set state(state: number)
    {
        this._state = state;
    }

    public get canMembersDecorate(): boolean
    {
        return this._canMembersDecorate;
    }

    public set canMembersDecorate(value: boolean)
    {
        this._canMembersDecorate = value;
    }
}
