import { createContext, FC, useContext } from 'react';
import { INitroCardContext, NitroCardContextProps } from './NitroCardContext.types';

const NitroCardContext = createContext<INitroCardContext>({
    theme: null
});

export const NitroCardContextProvider: FC<NitroCardContextProps> = props =>
{
    return <NitroCardContext.Provider value={ props.value }>{ props.children }</NitroCardContext.Provider>
}

export const useNitroCardContext = () => useContext(NitroCardContext);
