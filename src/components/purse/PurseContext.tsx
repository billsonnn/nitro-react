import { createContext, FC, ProviderProps, useContext } from 'react';
import { IPurse } from './common/IPurse';

interface IPurseContext
{
    purse: IPurse;
}

const PurseContext = createContext<IPurseContext>({
    purse: null
});

export const PurseContextProvider: FC<ProviderProps<IPurseContext>> = props =>
{
    return <PurseContext.Provider value={ props.value }>{ props.children }</PurseContext.Provider>
}

export const usePurseContext = () => useContext(PurseContext);
