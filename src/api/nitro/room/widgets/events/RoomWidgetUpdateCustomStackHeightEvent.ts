import { RoomWidgetUpdateEvent } from './RoomWidgetUpdateEvent';

export class RoomWidgetUpdateCustomStackHeightEvent extends RoomWidgetUpdateEvent
{
    public static UPDATE_CUSTOM_STACK_HEIGHT: string = 'RWUCSHE_UPDATE_CUSTOM_STACK_HEIGHT';

    private _objectId: number;
    private _height: number;

    constructor(objectId: number, height: number = 0)
    {
        super(RoomWidgetUpdateCustomStackHeightEvent.UPDATE_CUSTOM_STACK_HEIGHT);

        this._objectId = objectId;
        this._height = height;
    }

    public get objectId(): number
    {
        return this._objectId;
    }

    public get height(): number
    {
        return this._height;
    }
}
