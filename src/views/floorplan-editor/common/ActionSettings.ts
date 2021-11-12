import { FloorAction, HEIGHT_SCHEME } from './Constants';

export class ActionSettings
{
    private _currentAction: number;
    private _currentHeight: string;

    constructor()
    {
        this._currentAction = FloorAction.SET;
        this._currentHeight = HEIGHT_SCHEME[1];
    }

    public get currentAction(): number
    {
        return this._currentAction;
    }

    public set currentAction(value: number)
    {
        this._currentAction = value;
    }

    public get currentHeight(): string
    {
        return this._currentHeight;
    }

    public set currentHeight(value: string)
    {
        this._currentHeight = value;
    }

    public clear(): void
    {
        this._currentAction = FloorAction.SET;
        this._currentHeight = HEIGHT_SCHEME[1];
    }
}
