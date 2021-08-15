import { IRoomCameraWidgetEffect } from '@nitrots/nitro-renderer';

export interface CameraWidgetEffectListItemViewProps
{
    effect: IRoomCameraWidgetEffect;
    thumbnailUrl: string;
    isActive: boolean;
    isLocked: boolean;
    selectEffect: () => void;
    removeEffect: () => void;
}
