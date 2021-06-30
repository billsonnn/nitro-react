import { createContext, FC, useContext } from 'react';
import { IWiredContext, WiredContextProps } from './WiredContext.types';

const WiredContext = createContext<IWiredContext>({
    trigger: null,
    setTrigger: null,
    intParams: null,
    setIntParams: null,
    stringParam: null,
    setStringParam: null,
    furniIds: null,
    setFurniIds: null,
    actionDelay: null,
    setActionDelay: null
});

export const WiredContextProvider: FC<WiredContextProps> = props =>
{
    return <WiredContext.Provider value={ props.value }>{ props.children }</WiredContext.Provider>
}

export const useWiredContext = () => useContext(WiredContext);
