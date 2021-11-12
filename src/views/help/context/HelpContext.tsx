import { createContext, FC, useContext } from 'react';
import { HelpContextProps, IHelpContext } from './HelpContext.types';

const HelpContext = createContext<IHelpContext>({
    helpReportState: null,
    setHelpReportState: null
});

export const HelpContextProvider: FC<HelpContextProps> = props =>
{
    return <HelpContext.Provider value={ props.value }>{ props.children }</HelpContext.Provider>
}

export const useHelpContext = () => useContext(HelpContext);
