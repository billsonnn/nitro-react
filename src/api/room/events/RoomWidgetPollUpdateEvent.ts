import { PollQuestion } from '@nitrots/nitro-renderer';
import { RoomWidgetUpdateEvent } from './RoomWidgetUpdateEvent';

export class RoomWidgetPollUpdateEvent extends RoomWidgetUpdateEvent
{
    public static readonly OFFER = 'RWPUW_OFFER';
    public static readonly ERROR = 'RWPUW_ERROR';
    public static readonly CONTENT = 'RWPUW_CONTENT';

    private _id = -1;
    private _summary: string;
    private _headline: string;
    private _numQuestions = 0;
    private _startMessage = '';
    private _endMessage = '';
    private _questionArray: PollQuestion[] = null;
    private _pollType = '';
    private _npsPoll = false;

    constructor(type: string, id: number)
    {
        super(type);
        this._id = id;
    }

    public get id(): number
    {
        return this._id;
    }

    public get summary(): string
    {
        return this._summary;
    }

    public set summary(k: string)
    {
        this._summary = k;
    }

    public get headline(): string
    {
        return this._headline;
    }

    public set headline(k: string)
    {
        this._headline = k;
    }

    public get numQuestions(): number
    {
        return this._numQuestions;
    }

    public set numQuestions(k: number)
    {
        this._numQuestions = k;
    }

    public get startMessage(): string
    {
        return this._startMessage;
    }

    public set startMessage(k: string)
    {
        this._startMessage = k;
    }

    public get endMessage(): string
    {
        return this._endMessage;
    }

    public set endMessage(k: string)
    {
        this._endMessage = k;
    }

    public get questionArray(): PollQuestion[]
    {
        return this._questionArray;
    }

    public set questionArray(k: PollQuestion[])
    {
        this._questionArray = k;
    }

    public get pollType(): string
    {
        return this._pollType;
    }

    public set pollType(k: string)
    {
        this._pollType = k;
    }

    public get npsPoll(): boolean
    {
        return this._npsPoll;
    }

    public set npsPoll(k: boolean)
    {
        this._npsPoll = k;
    }
}
