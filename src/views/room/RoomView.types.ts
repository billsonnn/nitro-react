import { IEventDispatcher, IRoomSession } from 'nitro-renderer';
import { IProps } from '../../utils/IProps';

export interface RoomViewProps extends IProps
{
    events: IEventDispatcher;
    roomSession: IRoomSession;
}
