import { ProviderProps } from 'react';

export interface INitroCardContext
{
    theme: string;
    simple: boolean;
}

export interface NitroCardContextProps extends ProviderProps<INitroCardContext>
{

}
