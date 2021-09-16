import { RoomWidgetMessage } from './RoomWidgetMessage';

export class RoomWidgetDimmerChangeStateMessage extends RoomWidgetMessage
{
    public static CHANGE_STATE: string = 'RWCDSM_CHANGE_STATE';

    constructor()
    {
        super(RoomWidgetDimmerChangeStateMessage.CHANGE_STATE);
    }
}
