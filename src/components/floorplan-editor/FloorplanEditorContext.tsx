import { createContext, Dispatch, FC, ProviderProps, SetStateAction, useContext } from 'react';
import { IFloorplanSettings } from './common/IFloorplanSettings';
import { IVisualizationSettings } from './common/IVisualizationSettings';

interface IFloorplanEditorContext
{
    originalFloorplanSettings: IFloorplanSettings;
    setOriginalFloorplanSettings: Dispatch<SetStateAction<IFloorplanSettings>>;
    visualizationSettings: IVisualizationSettings;
    setVisualizationSettings: Dispatch<SetStateAction<IVisualizationSettings>>;
}

const FloorplanEditorContext = createContext<IFloorplanEditorContext>({
    originalFloorplanSettings: null,
    setOriginalFloorplanSettings: null,
    visualizationSettings: null,
    setVisualizationSettings: null
});

export const FloorplanEditorContextProvider: FC<ProviderProps<IFloorplanEditorContext>> = props => <FloorplanEditorContext.Provider { ...props } />;

export const useFloorplanEditorContext = () => useContext(FloorplanEditorContext);
