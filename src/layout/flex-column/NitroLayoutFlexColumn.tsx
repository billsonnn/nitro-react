import { FC, useMemo } from 'react';
import { NitroLayoutFlex } from '../flex/NitroLayoutFlex';
import { NitroLayoutFlexColumnProps } from './NitroLayoutFlexColumn.types';

export const NitroLayoutFlexColumn: FC<NitroLayoutFlexColumnProps> = props =>
{
    const { className = '', ...rest } = props;

    const getClassName = useMemo(() =>
    {
        let newClassName = 'flex-column';

        if(className && className.length) newClassName += ` ${ className }`;

        return newClassName;
    }, [ className ]);

    return <NitroLayoutFlex className={ getClassName } { ...rest } />;
}
