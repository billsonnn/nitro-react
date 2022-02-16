import { FC, useMemo } from 'react';
import { Base, BaseProps } from './Base';

export interface ButtonGroupProps extends BaseProps<HTMLDivElement>
{
}

export const ButtonGroup: FC<ButtonGroupProps> = props =>
{
    const { classNames = [], ...rest } = props;

    const getClassNames = useMemo(() =>
    {
        const newClassNames: string[] = [ 'btn-group' ];

        if(classNames.length) newClassNames.push(...classNames);

        return newClassNames;
    }, [ classNames ]);

    return <Base classNames={ getClassNames } { ...rest } />;
}
