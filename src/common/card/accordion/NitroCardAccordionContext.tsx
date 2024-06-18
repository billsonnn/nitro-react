import { createContext, Dispatch, FC, ProviderProps, SetStateAction, useContext } from 'react';

export interface INitroCardAccordionContext
{
    closers: Function[];
    setClosers: Dispatch<SetStateAction<Function[]>>;
    closeAll: () => void;
}

const NitroCardAccordionContext = createContext<INitroCardAccordionContext>({
    closers: null,
    setClosers: null,
    closeAll: null
});

export const NitroCardAccordionContextProvider: FC<ProviderProps<INitroCardAccordionContext>> = props =>
{
    return <NitroCardAccordionContext.Provider { ...props } />;
};

export const useNitroCardAccordionContext = () => useContext(NitroCardAccordionContext);
