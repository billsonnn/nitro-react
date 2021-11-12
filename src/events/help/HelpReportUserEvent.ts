import { HelpEvent } from './HelpEvent';

export class HelpReportUserEvent extends HelpEvent
{
    public static REPORT_USER: string = 'HCE_HELP_CENTER_REPORT_USER';
    
    private _reportedUserId: number;

    constructor(userId: number)
    {
        super(HelpReportUserEvent.REPORT_USER);

        this._reportedUserId = userId;
    }

    public get reportedUserId(): number
    {
        return this._reportedUserId;
    }
}
