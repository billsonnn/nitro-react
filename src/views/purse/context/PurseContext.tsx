import { createContext, FC, useContext } from 'react';
import { IPurseContext, PurseContextProps } from './PurseContext.types';

const PurseContext = createContext<IPurseContext>({
    purse: null
});

export const PurseContextProvider: FC<PurseContextProps> = props =>
{
    return <PurseContext.Provider value={ props.value }>{ props.children }</PurseContext.Provider>
}

export const usePurseContext = () => useContext(PurseContext);
