import { FC, useCallback, useState } from 'react';
import { Column, ColumnProps } from '../..';
import { NitroCardAccordionContextProvider } from './NitroCardAccordionContext';

interface NitroCardAccordionViewProps extends ColumnProps
{

}

export const NitroCardAccordionView: FC<NitroCardAccordionViewProps> = props =>
{
    const { ...rest } = props;
    const [ closers, setClosers ] = useState<Function[]>([]);

    const closeAll = useCallback(() =>
    {
        for(const closer of closers) closer();
    }, [ closers ]);

    return (
        <NitroCardAccordionContextProvider value={ { closers, setClosers, closeAll } }>
            <Column gap={ 0 } { ...rest } />
        </NitroCardAccordionContextProvider>
    );
};
