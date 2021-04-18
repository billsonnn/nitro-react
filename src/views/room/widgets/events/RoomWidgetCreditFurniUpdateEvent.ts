import { RoomWidgetUpdateEvent } from 'nitro-renderer';

export class RoomWidgetCreditFurniUpdateEvent extends RoomWidgetUpdateEvent
{
    public static RWCFUE_CREDIT_FURNI_UPDATE: string = 'RWCFUE_CREDIT_FURNI_UPDATE';

    private _objectId: number;
    private _value: number;
    private _furniType: string;

    constructor(k: string, furniType: string, _arg_2: number, _arg_3: number)
    {
        super(k);

        this._value = _arg_3;
        this._objectId = _arg_2;
        this._furniType = furniType;
    }

    public get value(): number
    {
        return this._value;
    }

    public get objectId(): number
    {
        return this._objectId;
    }

    public get furniType(): string
    {
        return this._furniType;
    }
}
