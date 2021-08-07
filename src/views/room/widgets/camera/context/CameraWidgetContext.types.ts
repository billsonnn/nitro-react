import { IRoomCameraWidgetSelectedEffect } from '@nitrots/nitro-renderer';
import { Dispatch, ProviderProps, SetStateAction } from 'react';
import { CameraPicture } from '../common/CameraPicture';

export interface ICameraWidgetContext
{
    cameraRoll: CameraPicture[],
    setCameraRoll: Dispatch<SetStateAction<CameraPicture[]>>;
    selectedPictureIndex: number,
    setSelectedPictureIndex: Dispatch<SetStateAction<number>>;
    selectedEffects: IRoomCameraWidgetSelectedEffect[],
    setSelectedEffects: Dispatch<SetStateAction<IRoomCameraWidgetSelectedEffect[]>>;
    isZoomed: boolean,
    setIsZoomed: Dispatch<SetStateAction<boolean>>;
}

export interface CameraWidgetContextProps extends ProviderProps<ICameraWidgetContext>
{}
