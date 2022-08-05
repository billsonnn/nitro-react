export class ModActionDefinition
{
    public static ALERT: number = 1;
    public static MUTE: number = 2;
    public static BAN: number = 3;
    public static KICK: number = 4;
    public static TRADE_LOCK: number = 5;
    public static MESSAGE: number = 6;

    private readonly _actionId: number;
    private readonly _name: string;
    private readonly _actionType: number;
    private readonly _sanctionTypeId: number;
    private readonly _actionLengthHours: number;

    constructor(actionId: number, actionName: string, actionType: number, sanctionTypeId: number, actionLengthHours:number)
    {
        this._actionId = actionId;
        this._name = actionName;
        this._actionType = actionType;
        this._sanctionTypeId = sanctionTypeId;
        this._actionLengthHours = actionLengthHours;
    }

    public get actionId(): number
    {
        return this._actionId;
    }

    public get name(): string
    {
        return this._name;
    }

    public get actionType(): number
    {
        return this._actionType;
    }

    public get sanctionTypeId(): number
    {
        return this._sanctionTypeId;
    }

    public get actionLengthHours(): number
    {
        return this._actionLengthHours;
    }
}
