import { createContext, Dispatch, FC, ProviderProps, SetStateAction, useContext } from 'react';
import { CameraPicture } from './common/CameraPicture';

export interface ICameraWidgetContext
{
    cameraRoll: CameraPicture[],
    setCameraRoll: Dispatch<SetStateAction<CameraPicture[]>>;
    selectedPictureIndex: number,
    setSelectedPictureIndex: Dispatch<SetStateAction<number>>;
}

const CameraWidgetContext = createContext<ICameraWidgetContext>({
    cameraRoll: null,
    setCameraRoll: null,
    selectedPictureIndex: null,
    setSelectedPictureIndex: null
});

export const CameraWidgetContextProvider: FC<ProviderProps<ICameraWidgetContext>> = props =>
{
    return <CameraWidgetContext.Provider value={ props.value }>{ props.children }</CameraWidgetContext.Provider>
}

export const useCameraWidgetContext = () => useContext(CameraWidgetContext);
