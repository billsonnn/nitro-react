import { GetRoomSessionManager } from '@nitrots/nitro-renderer';
import { GetRoomSession } from './GetRoomSession';
import { GoToDesktop } from './GoToDesktop';

export const VisitDesktop = () =>
{
    if(!GetRoomSession()) return;

    GoToDesktop();
    GetRoomSessionManager().removeSession(-1);
}
