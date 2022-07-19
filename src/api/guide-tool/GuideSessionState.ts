export class GuideSessionState
{
    public static readonly NONE: string = 'NONE';
    public static readonly ERROR: string = 'ERROR';
    public static readonly REJECTED: string = 'REJECTED';
    public static readonly USER_CREATE: string = 'USER_CREATE';
    public static readonly USER_PENDING: string = 'USER_PENDING';
    public static readonly USER_ONGOING: string = 'USER_ONGOING';
    public static readonly USER_FEEDBACK: string = 'USER_FEEDBACK';
    public static readonly USER_THANKS: string = 'USER_THANKS';
    public static readonly USER_GUIDE_DISCONNECTED: string = 'USER_GUIDE_DISCONNECTED';
    public static readonly GUIDE_TOOL_MENU: string = 'GUIDE_TOOL_MENU';
    public static readonly GUIDE_ACCEPT: string = 'GUIDE_ACCEPT';
    public static readonly GUIDE_ONGOING: string = 'GUIDE_ONGOING';
    public static readonly GUIDE_CLOSED: string = 'GUIDE_CLOSED';
    public static readonly GUARDIAN_CHAT_REVIEW_ACCEPT: string = 'GUARDIAN_CHAT_REVIEW_ACCEPT';
    public static readonly GUARDIAN_CHAT_REVIEW_WAIT_FOR_VOTERS: string = 'GUARDIAN_CHAT_REVIEW_WAIT_FOR_VOTERS';
    public static readonly GUARDIAN_CHAT_REVIEW_VOTE: string = 'GUARDIAN_CHAT_REVIEW_VOTE';
    public static readonly GUARDIAN_CHAT_REVIEW_WAIT_FOR_RESULTS: string = 'GUARDIAN_CHAT_REVIEW_WAIT_FOR_RESULTS';
    public static readonly GUARDIAN_CHAT_REVIEW_RESULTS: string = 'GUARDIAN_CHAT_REVIEW_RESULTS';
}
