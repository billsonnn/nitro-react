import { FC, useMemo } from 'react';
import { NitroLayoutFlex } from '../..';
import { NitroCardSubHeaderViewProps } from './NitroCardSubHeaderView.types';

export const NitroCardSubHeaderView: FC<NitroCardSubHeaderViewProps> = props =>
{
    const { className = '', ...rest } = props;

    const getClassName = useMemo(() =>
    {
        let newClassName = 'container-fluid bg-muted justify-content-center py-1';

        if(className && className.length) newClassName += ` ${ className }`;

        return newClassName;
    }, [ className ]);

    return (
        <NitroLayoutFlex className={ getClassName } { ...rest } />
    );
}
