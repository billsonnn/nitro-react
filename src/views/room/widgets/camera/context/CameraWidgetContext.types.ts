import { IRoomCameraWidgetSelectedEffect } from 'nitro-renderer/src/nitro/camera/IRoomCameraWidgetSelectedEffect';
import { ProviderProps } from 'react';

export interface ICameraWidgetContext
{
    cameraRoll: HTMLImageElement[],
    setCameraRoll: (cameraRoll: HTMLImageElement[]) => void,
    selectedPictureIndex: number,
    setSelectedPictureIndex: (index: number) => void,
    selectedEffects: IRoomCameraWidgetSelectedEffect[],
    setSelectedEffects: (selectedEffects: IRoomCameraWidgetSelectedEffect[]) => void,
    isZoomed: boolean,
    setIsZoomed: (isZoomed: boolean) => void
}

export interface CameraWidgetContextProps extends ProviderProps<ICameraWidgetContext>
{}
