import { createContext, FC, useContext } from 'react';
import { FloorplanEditorContextProps, IFloorplanEditorContext } from './FloorplanEditorContext.types';

const FloorplanEditorContext = createContext<IFloorplanEditorContext>({
    originalFloorplanSettings: null,
    setOriginalFloorplanSettings: null,
    visualizationSettings: null,
    setVisualizationSettings: null
});

export const FloorplanEditorContextProvider: FC<FloorplanEditorContextProps> = props =>
{
    return <FloorplanEditorContext.Provider value={ props.value }>{ props.children }</FloorplanEditorContext.Provider>
}

export const useFloorplanEditorContext = () => useContext(FloorplanEditorContext);
