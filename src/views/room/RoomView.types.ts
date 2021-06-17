import { IRoomSession } from 'nitro-renderer';
import { IProps } from '../../utils/IProps';

export interface RoomViewProps extends IProps
{
    roomSession: IRoomSession;
}
