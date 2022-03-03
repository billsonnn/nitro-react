import { createContext, FC, ProviderProps, useContext } from 'react';

interface INitroCardContext
{
    theme: string;
    simple: boolean;
}

const NitroCardContext = createContext<INitroCardContext>({
    theme: null,
    simple: false
});

export const NitroCardContextProvider: FC<ProviderProps<INitroCardContext>> = props =>
{
    return <NitroCardContext.Provider value={ props.value }>{ props.children }</NitroCardContext.Provider>
}

export const useNitroCardContext = () => useContext(NitroCardContext);
