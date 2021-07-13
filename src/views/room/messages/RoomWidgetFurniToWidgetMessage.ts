import { RoomWidgetMessage } from './RoomWidgetMessage';

export class RoomWidgetFurniToWidgetMessage extends RoomWidgetMessage
{
    public static REQUEST_CREDITFURNI: string = 'RWFWM_MESSAGE_REQUEST_CREDITFURNI';
    public static REQUEST_STICKIE: string = 'RWFWM_MESSAGE_REQUEST_STICKIE';
    public static REQUEST_PRESENT: string = 'RWFWM_MESSAGE_REQUEST_PRESENT';
    public static REQUEST_TROPHY: string = 'RWFWM_MESSAGE_REQUEST_TROPHY';
    public static REQUEST_TEASER: string = 'RWFWM_MESSAGE_REQUEST_TEASER';
    public static REQUEST_ECOTRONBOX: string = 'RWFWM_MESSAGE_REQUEST_ECOTRONBOX';
    public static REQUEST_DIMMER: string = 'RWFWM_MESSAGE_REQUEST_DIMMER';
    public static REQUEST_PLACEHOLDER: string = 'RWFWM_MESSAGE_REQUEST_PLACEHOLDER';
    public static REQUEST_CLOTHING_CHANGE: string = 'RWFWM_MESSAGE_REQUEST_CLOTHING_CHANGE';
    public static REQUEST_PLAYLIST_EDITOR: string = 'RWFWM_MESSAGE_REQUEST_PLAYLIST_EDITOR';
    public static REQUEST_ACHIEVEMENT_RESOLUTION_ENGRAVING: string = 'RWFWM_WIDGET_MESSAGE_REQUEST_ACHIEVEMENT_RESOLUTION_ENGRAVING';
    public static REQUEST_ACHIEVEMENT_RESOLUTION_FAILED: string = 'RWFWM_WIDGET_MESSAGE_REQUEST_ACHIEVEMENT_RESOLUTION_FAILED';
    public static REQUEST_BADGE_DISPLAY_ENGRAVING: string = 'RWFWM_WIDGET_MESSAGE_REQUEST_BADGE_DISPLAY_ENGRAVING';

    private _objectId: number;
    private _category: number;
    private _roomId: number;

    constructor(type: string, objectId: number, category: number, roomId: number)
    {
        super(type);

        this._objectId  = objectId;
        this._category  = category;
        this._roomId    = roomId;
    }

    public get objectId(): number
    {
        return this._objectId;
    }

    public get category(): number
    {
        return this._category;
    }

    public get roomId(): number
    {
        return this._roomId;
    }
}
