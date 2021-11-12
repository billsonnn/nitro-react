import { FC, useMemo } from 'react';
import { NitroLayoutFlexColumn } from '../../flex-column/NitroLayoutFlexColumn';
import { NitroLayoutGridColumnProps } from './NitroLayoutGridColumn.types';

export const NitroLayoutGridColumn: FC<NitroLayoutGridColumnProps> = props =>
{
    const { className = '', size = 12, gap = 2, overflow = 'auto', ...rest } = props;

    const getClassName = useMemo(() =>
    {
        let newClassName = `g-col-${ size }`;

        if(className && className.length) newClassName += ` ${ className }`;

        return newClassName;
    }, [ className, size ]);

    return <NitroLayoutFlexColumn className={ getClassName } gap={ gap } overflow={ overflow } { ...rest } />
}
