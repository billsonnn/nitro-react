import { IRoomCameraWidgetSelectedEffect } from 'nitro-renderer/src/nitro/camera/IRoomCameraWidgetSelectedEffect';
import { ProviderProps } from 'react';
import { CameraPicture } from '../common/CameraPicture';

export interface ICameraWidgetContext
{
    cameraRoll: CameraPicture[],
    setCameraRoll: (cameraRoll: CameraPicture[]) => void,
    selectedPictureIndex: number,
    setSelectedPictureIndex: (index: number) => void,
    selectedEffects: IRoomCameraWidgetSelectedEffect[],
    setSelectedEffects: (selectedEffects: IRoomCameraWidgetSelectedEffect[]) => void,
    isZoomed: boolean,
    setIsZoomed: (isZoomed: boolean) => void
}

export interface CameraWidgetContextProps extends ProviderProps<ICameraWidgetContext>
{}
