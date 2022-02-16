import { Triggerable } from '@nitrots/nitro-renderer';
import { createContext, Dispatch, FC, ProviderProps, SetStateAction, useContext } from 'react';

export interface IWiredContext
{
    trigger: Triggerable;
    setTrigger: Dispatch<SetStateAction<Triggerable>>;
    intParams: number[],
    setIntParams: Dispatch<SetStateAction<number[]>>;
    stringParam: string;
    setStringParam: Dispatch<SetStateAction<string>>;
    furniIds: number[];
    setFurniIds: Dispatch<SetStateAction<number[]>>;
    actionDelay: number;
    setActionDelay: Dispatch<SetStateAction<number>>;
}

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

export const WiredContextProvider: FC<ProviderProps<IWiredContext>> = props =>
{
    return <WiredContext.Provider value={ props.value }>{ props.children }</WiredContext.Provider>
}

export const useWiredContext = () => useContext(WiredContext);
