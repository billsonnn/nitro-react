import { RoomWidgetUpdateEvent } from 'nitro-renderer';
import { Texture } from 'pixi.js';

export class RoomWidgetPetPackageUpdateEvent extends RoomWidgetUpdateEvent
{
    public static RWOPPUE_OPEN_PET_PACKAGE_REQUESTED: string = 'RWOPPUE_OPEN_PET_PACKAGE_REQUESTED';
    public static RWOPPUE_OPEN_PET_PACKAGE_RESULT: string = 'RWOPPUE_OPEN_PET_PACKAGE_RESULT';
    public static RWOPPUE_OPEN_PET_PACKAGE_UPDATE_PET_IMAGE: string = 'RWOPPUE_OPEN_PET_PACKAGE_UPDATE_PET_IMAGE';

    private _Str_2319: number = -1;
    private _typeId: number = -1;
    private _image: Texture = null;
    private _nameValidationStatus: number = 0;
    private _nameValidationInfo: string = null;

    constructor(k: string, _arg_2: number, _arg_3: Texture, _arg_4: number, _arg_5: string, _arg_6: number)
    {
        super(k);

        this._Str_2319 = _arg_2;
        this._image = _arg_3;
        this._nameValidationStatus = _arg_4;
        this._nameValidationInfo = _arg_5;
        this._typeId = _arg_6;
    }

    public get nameValidationStatus(): number
    {
        return this._nameValidationStatus;
    }

    public get nameValidationInfo(): string
    {
        return this._nameValidationInfo;
    }

    public get image(): Texture
    {
        return this._image;
    }

    public get _Str_1577(): number
    {
        return this._Str_2319;
    }

    public get typeId(): number
    {
        return this._typeId;
    }
}
