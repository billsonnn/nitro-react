import { HelpEvent } from './HelpEvent';

export class HelpReportUserEvent extends HelpEvent
{
    public static REPORT_USER: string = 'HCE_HELP_CENTER_REPORT_USER';
    
    private _reportedUserId: number;
    private _reportedUsername: string;

    constructor(userId: number, username: string)
    {
        super(HelpReportUserEvent.REPORT_USER);

        this._reportedUserId = userId;
        this._reportedUsername = username;
    }

    public get reportedUserId(): number
    {
        return this._reportedUserId;
    }

    public get reportedUsername(): string
    {
        return this._reportedUsername;
    }
}
