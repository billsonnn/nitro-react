import { createContext, FC, useContext } from 'react';
import { CameraWidgetContextProps, ICameraWidgetContext } from './CameraWidgetContext.types';

const CameraWidgetContext = createContext<ICameraWidgetContext>({
    cameraRoll: null,
    setCameraRoll: null,
    selectedPictureIndex: null,
    setSelectedPictureIndex: null
});

export const CameraWidgetContextProvider: FC<CameraWidgetContextProps> = props =>
{
    return <CameraWidgetContext.Provider value={ props.value }>{ props.children }</CameraWidgetContext.Provider>
}

export const useCameraWidgetContext = () => useContext(CameraWidgetContext);
