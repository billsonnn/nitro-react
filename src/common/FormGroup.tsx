import { FC, useMemo } from 'react';
import { Flex, FlexProps } from './Flex';

export interface FormGroupProps extends FlexProps
{
}

export const FormGroup: FC<FormGroupProps> = props =>
{
    const { classNames = [], ...rest } = props;

    const getClassNames = useMemo(() =>
    {
        const newClassNames: string[] = [ 'form-group' ];

        if(classNames.length) newClassNames.push(...classNames);

        return newClassNames;
    }, [ classNames ]);

    return <Flex classNames={ getClassNames } { ...rest } />;
};
