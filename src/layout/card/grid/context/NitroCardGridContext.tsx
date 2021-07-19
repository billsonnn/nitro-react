import { createContext, FC, useContext } from 'react';
import { INitroCardGridContext, NitroCardGridContextProps } from './NitroCardGridContext.types';

const NitroCardGridContext = createContext<INitroCardGridContext>({
    theme: null
});

export const NitroCardGridContextProvider: FC<NitroCardGridContextProps> = props =>
{
    return <NitroCardGridContext.Provider value={ props.value }>{ props.children }</NitroCardGridContext.Provider>
}

export const useNitroCardGridContext = () => useContext(NitroCardGridContext);
