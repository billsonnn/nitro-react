import { RoomWidgetMessage } from './RoomWidgetMessage';

export class RoomWidgetPresentOpenMessage extends RoomWidgetMessage
{
    public static OPEN_PRESENT: string = 'RWPOM_OPEN_PRESENT';

    private _objectId: number;

    constructor(type: string, objectId: number)
    {
        super(type);

        this._objectId = objectId;
    }

    public get objectId(): number
    {
        return this._objectId;
    }
}
