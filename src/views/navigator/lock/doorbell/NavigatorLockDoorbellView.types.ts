import { NavigatorLockViewStage } from '../NavigatorLockView.types';

export interface NavigatorLockDoorbellViewProps
{
    stage: NavigatorLockViewStage;
    onVisitRoom: (password?: string) => void;
    onHideLock: () => void;
}
