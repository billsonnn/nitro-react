import { NavigatorLockViewStage } from '../NavigatorLockView.types';

export interface NavigatorLockPasswordViewProps
{
    stage: NavigatorLockViewStage;
    onVisitRoom: (password?: string) => void;
    onHideLock: () => void;
}
