import { Dispatch, ProviderProps, SetStateAction } from 'react';
import { CameraPicture } from '../common/CameraPicture';

export interface ICameraWidgetContext
{
    cameraRoll: CameraPicture[],
    setCameraRoll: Dispatch<SetStateAction<CameraPicture[]>>;
    selectedPictureIndex: number,
    setSelectedPictureIndex: Dispatch<SetStateAction<number>>;
}

export interface CameraWidgetContextProps extends ProviderProps<ICameraWidgetContext>
{}
