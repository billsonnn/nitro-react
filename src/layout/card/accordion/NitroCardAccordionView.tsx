import { FC, useCallback, useMemo, useState } from 'react';
import { NitroLayoutFlexColumn } from '../..';
import { NitroCardAccordionContextProvider } from './NitroCardAccordionContext';
import { NitroCardAccordionViewProps } from './NitroCardAccordionView.types';

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
            <NitroLayoutFlexColumn className={ getClassName } { ...rest }>
                { children }
            </NitroLayoutFlexColumn>
        </NitroCardAccordionContextProvider>
    );
}
