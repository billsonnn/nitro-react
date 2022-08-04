import { GetRoomSession, GetRoomSessionManager, GoToDesktop } from '.';

export const VisitDesktop = () =>
{
    if(!GetRoomSession()) return;

    GoToDesktop();
    GetRoomSessionManager().removeSession(-1);
}
