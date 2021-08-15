import { Triggerable } from '@nitrots/nitro-renderer';
import { Dispatch, ProviderProps, SetStateAction } from 'react';

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

export interface WiredContextProps extends ProviderProps<IWiredContext>
{

}
