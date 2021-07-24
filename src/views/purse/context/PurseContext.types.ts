import { ProviderProps } from 'react';
import { IPurse } from '../common/IPurse';

export interface IPurseContext
{
    purse: IPurse;
}

export interface PurseContextProps extends ProviderProps<IPurseContext>
{

}
