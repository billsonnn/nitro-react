import { RoomWidgetUpdateEvent } from 'nitro-renderer';

export class RoomWidgetRoomQueueUpdateEvent extends RoomWidgetUpdateEvent
{
    public static RWRQUE_VISITOR_QUEUE_STATUS: string = 'RWRQUE_VISITOR_QUEUE_STATUS';
    public static RWRQUE_SPECTATOR_QUEUE_STATUS: string = 'RWRQUE_SPECTATOR_QUEUE_STATUS';

    private _position: number;
    private _Str_19946: boolean;
    private _isActive: boolean;
    private _Str_9011: boolean;

    constructor(k: string, _arg_2: number, _arg_3: boolean, _arg_4: boolean, _arg_5: boolean)
    {
        super(k);

        this._position = _arg_2;
        this._Str_19946 = _arg_3;
        this._isActive = _arg_4;
        this._Str_9011 = _arg_5;
    }

    public get position(): number
    {
        return this._position;
    }

    public get _Str_25661(): boolean
    {
        return this._Str_19946;
    }

    public get isActive(): boolean
    {
        return this._isActive;
    }

    public get _Str_23206(): boolean
    {
        return this._Str_9011;
    }
}
