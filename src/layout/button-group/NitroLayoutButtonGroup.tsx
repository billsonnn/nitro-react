import { FC, useMemo } from 'react';
import { NitroLayoutBase } from '../base';
import { NitroLayoutButtonGroupProps } from './NitroLayoutButtonGroup.types';

export const NitroLayoutButtonGroup: FC<NitroLayoutButtonGroupProps> = props =>
{
    const { className = '', ...rest } = props;

    const getClassName = useMemo(() =>
    {
        let newClassName = 'btn-group';

        if(className && className.length) newClassName += ` ${ className }`;

        return newClassName;
    }, [ className ]);

    return <NitroLayoutBase className={ getClassName } { ...rest } />;
}
