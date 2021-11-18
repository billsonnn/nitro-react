import { IQuestion } from '@nitrots/nitro-renderer';
import { RoomWidgetUpdateEvent } from './RoomWidgetUpdateEvent';

export class RoomWidgetWordQuizUpdateEvent extends RoomWidgetUpdateEvent
{
    public static readonly NEW_QUESTION = 'RWPUW_NEW_QUESTION';
    public static readonly QUESTION_FINISHED = 'RWPUW_QUESION_FINSIHED';
    public static readonly QUESTION_ANSWERED = 'RWPUW_QUESTION_ANSWERED';

    private _id: number = -1;
    private _pollType: string = null;
    private _pollId: number = -1;
    private _questionId: number = -1;
    private _duration: number = -1;
    private _question: IQuestion = null;
    private _userId: number = -1;
    private _value: string;
    private _answerCounts: Map<string, number>;

    constructor(type: string, id: number)
    {
        super(type);
        this._id = id;
    }

    public get id(): number
    {
        return this._id;
    }

    public get pollType(): string
    {
        return this._pollType;
    }

    public set pollType(k: string)
    {
        this._pollType = k;
    }

    public get pollId(): number
    {
        return this._pollId;
    }

    public set pollId(k: number)
    {
        this._pollId = k;
    }

    public get questionId(): number
    {
        return this._questionId;
    }

    public set questionId(k: number)
    {
        this._questionId = k;
    }

    public get duration(): number
    {
        return this._duration;
    }

    public set duration(k: number)
    {
        this._duration = k;
    }

    public get question(): IQuestion
    {
        return this._question;
    }

    public set question(k: IQuestion)
    {
        this._question = k;
    }

    public get userId(): number
    {
        return this._userId;
    }

    public set userId(k: number)
    {
        this._userId = k;
    }

    public get value(): string
    {
        return this._value;
    }

    public set value(k: string)
    {
        this._value = k;
    }

    public get answerCounts(): Map<string, number>
    {
        return this._answerCounts;
    }

    public set answerCounts(k: Map<string, number>)
    {
        this._answerCounts = k;
    }
}
