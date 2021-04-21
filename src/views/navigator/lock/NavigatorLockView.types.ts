import { RoomDataParser } from 'nitro-renderer';

export interface NavigatorLockViewProps
{
    roomData: RoomDataParser;
    stage: NavigatorLockViewStage;
    onHideLock: () => void;
    onVisitRoom: (roomId: number, password?: string) => void;
}

export enum NavigatorLockViewStage
{
    INIT = 'navigator_lock_view_stage_init',
    WAITING = 'navigator_lock_view_stage_waiting',
    FAILED = 'navigator_lock_view_stage_failed'
}
