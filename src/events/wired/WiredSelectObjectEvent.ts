import { WiredEvent } from './WiredEvent';

export class WiredSelectObjectEvent extends WiredEvent
{
    public static SELECT_OBJECT: string = 'WE_SELECT_OBJECT';

    private _objectId: number;
    private _category: number;

    constructor(objectId = -1, category = -1)
    {
        super(WiredSelectObjectEvent.SELECT_OBJECT);

        this._objectId = objectId;
        this._category = category;
    }

    public get objectId(): number
    {
        return this._objectId;
    }

    public get category(): number
    {
        return this._category;
    }
}
