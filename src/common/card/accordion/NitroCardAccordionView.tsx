import { FC, useCallback, useMemo, useState } from 'react';
import { Column, ColumnProps } from '../..';
import { NitroCardAccordionContextProvider } from './NitroCardAccordionContext';

interface NitroCardAccordionViewProps extends ColumnProps
{
    
}

export const NitroCardAccordionView: FC<NitroCardAccordionViewProps> = props =>
{
    const { className = '', children = null, ...rest } = props;
    const [ closers, setClosers ] = useState<Function[]>([]);

    const getClassName = useMemo(() =>
    {
        let newClassName = 'nitro-card-accordion text-black';

        if(className && className.length) newClassName += ` ${ className }`;

        return newClassName;
    }, [ className ]);

    const closeAll = useCallback(() =>
    {
        for(const closer of closers) closer();
    }, [ closers ]);

    return (
        <NitroCardAccordionContextProvider value={ { closers, setClosers, closeAll } }>
            <Column className={ getClassName } { ...rest }>
                { children }
            </Column>
        </NitroCardAccordionContextProvider>
    );
}
