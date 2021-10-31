import { createContext, FC, useContext } from 'react';
import { FloorplanEditorContextProps, IFloorplanEditorContext } from './FloorplanEditorContext.types';

const FloorplanEditorContext = createContext<IFloorplanEditorContext>({
    floorplanSettings: null,
    setFloorplanSettings: null
});

export const FloorplanEditorContextProvider: FC<FloorplanEditorContextProps> = props =>
{
    return <FloorplanEditorContext.Provider value={ props.value }>{ props.children }</FloorplanEditorContext.Provider>
}

export const useFloorplanEditorContext = () => useContext(FloorplanEditorContext);
