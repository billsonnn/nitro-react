import { RoomWidgetMessage } from './RoomWidgetMessage';

export class RoomWidgetRoomObjectMessage extends RoomWidgetMessage
{
    public static GET_OBJECT_INFO: string = 'RWROM_GET_OBJECT_INFO';
    public static GET_OBJECT_NAME: string = 'RWROM_GET_OBJECT_NAME';
    public static SELECT_OBJECT: string = 'RWROM_SELECT_OBJECT';
    public static GET_OWN_CHARACTER_INFO: string = 'RWROM_GET_OWN_CHARACTER_INFO';
    public static GET_AVATAR_LIST: string = 'RWROM_GET_AVATAR_LIST';

    private _id: number;
    private _category: number;

    constructor(type: string, id: number, category: number)
    {
        super(type);

        this._id        = id;
        this._category  = category;
    }

    public get id(): number
    {
        return this._id;
    }

    public get category(): number
    {
        return this._category;
    }
}
