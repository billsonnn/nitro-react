import { RoomWidgetMessage } from '.';

export class RoomWidgetZoomToggleMessage extends RoomWidgetMessage
{
    public static ZOOM_TOGGLE: string = 'RWZTM_ZOOM_TOGGLE';
    private _zoomedIn: boolean;

    constructor(zoomedIn: boolean)
    {
        super(RoomWidgetZoomToggleMessage.ZOOM_TOGGLE);
        this._zoomedIn = zoomedIn;
    }
    
    public get zoomedIn(): boolean
    {
        return this._zoomedIn;
    }
}
