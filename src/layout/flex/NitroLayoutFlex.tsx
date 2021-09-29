import { FC, useMemo } from 'react';
import { NitroLayoutBase } from '../base/NitroLayoutBase';
import { NitroLayoutFlexProps } from './NitroLayoutFlex.types';

export const NitroLayoutFlex: FC<NitroLayoutFlexProps> = props =>
{
    const { className = '', ...rest } = props;

    const getClassName = useMemo(() =>
    {
        let newClassName = 'd-flex';

        if(className && className.length) newClassName += ` ${ className }`;

        return newClassName;
    }, [ className ]);

    return <NitroLayoutBase className={ getClassName } { ...rest } />;
}
