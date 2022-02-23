import { createContext, Dispatch, FC, ProviderProps, SetStateAction, useContext } from 'react';
import { IHelpReportState } from './common/IHelpReportState';

interface IHelpContext
{
    helpReportState: IHelpReportState;
    setHelpReportState: Dispatch<SetStateAction<IHelpReportState>>;
}

const HelpContext = createContext<IHelpContext>({
    helpReportState: null,
    setHelpReportState: null
});

export const HelpContextProvider: FC<ProviderProps<IHelpContext>> = props =>
{
    return <HelpContext.Provider value={ props.value }>{ props.children }</HelpContext.Provider>
}

export const useHelpContext = () => useContext(HelpContext);
