import { RoomWidgetUpdateEvent } from './RoomWidgetUpdateEvent';

export class RoomWidgetUpdateCreditFurniEvent extends RoomWidgetUpdateEvent
{
    public static CREDIT_FURNI_UPDATE: string = 'RWUCFE_CREDIT_FURNI_UPDATE';

    private _objectId: number;
    private _value: number;
    private _furniType: string;

    constructor(type: string, objectId: number, value: number, furniType: string)
    {
        super(type);

        this._objectId = objectId;
        this._value = value;
        this._furniType = furniType;
    }

    public get objectId(): number
    {
        return this._objectId;
    }

    public get value(): number
    {
        return this._value;
    }

    public get furniType(): string
    {
        return this._furniType;
    }
}
