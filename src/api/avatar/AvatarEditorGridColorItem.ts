import { ColorConverter, IPartColor } from '@nitrots/nitro-renderer';

export class AvatarEditorGridColorItem
{
    private _partColor: IPartColor;
    private _isDisabled: boolean;
    private _isHC: boolean;
    private _isSelected: boolean;
    private _notifier: () => void;

    constructor(partColor: IPartColor, isDisabled: boolean = false)
    {
        this._partColor = partColor;
        this._isDisabled = isDisabled;
        this._isHC = (this._partColor.clubLevel > 0);
        this._isSelected = false;
    }

    public dispose(): void
    {
        this._partColor = null;
    }

    public get partColor(): IPartColor
    {
        return this._partColor;
    }

    public get color(): string
    {
        return ColorConverter.int2rgb(this._partColor.rgb);
    }

    public get isDisabled(): boolean
    {
        return this._isDisabled;
    }

    public get isHC(): boolean
    {
        return this._isHC;
    }

    public get isSelected(): boolean
    {
        return this._isSelected;
    }

    public set isSelected(flag: boolean)
    {
        this._isSelected = flag;

        if(this.notify) this.notify();
    }

    public get notify(): () => void
    {
        return this._notifier;
    }

    public set notify(notifier: () => void)
    {
        this._notifier = notifier;
    }
}
