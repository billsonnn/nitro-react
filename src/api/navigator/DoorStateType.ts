export class DoorStateType
{
    public static NONE: number = 0;
    public static START_DOORBELL: number = 1;
    public static START_PASSWORD: number = 2;
    public static STATE_PENDING_SERVER: number = 3;
    public static UPDATE_STATE: number = 4;
    public static STATE_WAITING: number = 5;
    public static STATE_NO_ANSWER: number = 6;
    public static STATE_WRONG_PASSWORD: number = 7;
    public static STATE_ACCEPTED: number = 8;
}
