import { FC, useMemo } from 'react';
import { Column, ColumnProps } from '../../../../common';

export const ContextMenuListView: FC<ColumnProps> = props =>
{
    const { classNames = [], ...rest } = props;

    const getClassNames = useMemo(() =>
    {
        const newClassNames: string[] = [ 'menu-list' ];

        if(classNames.length) newClassNames.push(...classNames);

        return newClassNames;
    }, [ classNames ]);

    return <Column classNames={ getClassNames } { ...rest } />;
};
