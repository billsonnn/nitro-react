import { NitroEvent } from '@nitrots/nitro-renderer';

export class HelpReportUserEvent extends NitroEvent
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
