export class NotificationConfirmItem
{
    private static ITEM_ID: number = -1;

    private _id: number;
    private _confirmType: string;
    private _message: string;
    private _onConfirm: Function;
    private _onCancel: Function;
    private _confirmText: string;
    private _cancelText: string;
    private _title: string;

    constructor(confirmType: string, message: string, onConfirm: Function, onCancel: Function, confirmText: string, cancelText: string, title: string)
    {
        NotificationConfirmItem.ITEM_ID += 1;

        this._id = NotificationConfirmItem.ITEM_ID;
        this._confirmType = confirmType;
        this._message = message;
        this._onConfirm = onConfirm;
        this._onCancel = onCancel;
        this._confirmText = confirmText;
        this._cancelText = cancelText;
        this._title = title;
    }

    public get id(): number
    {
        return this._id;
    }

    public get confirmType(): string
    {
        return this._confirmType;
    }

    public get message(): string
    {
        return this._message;
    }

    public get onConfirm(): Function
    {
        return this._onConfirm;
    }

    public get onCancel(): Function
    {
        return this._onCancel;
    }

    public get confirmText(): string
    {
        return this._confirmText;
    }

    public get cancelText(): string
    {
        return this._cancelText;
    }

    public get title(): string
    {
        return this._title;
    }
}
