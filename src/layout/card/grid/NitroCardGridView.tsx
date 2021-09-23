import { FC, useMemo } from 'react';
import { NitroCardGridViewProps } from './NitroCardGridView.types';

export const NitroCardGridView: FC<NitroCardGridViewProps> = props =>
{
    const { columns = 5, gap = 2, className = '', style = null, children = null, ...rest } = props;

    const getClassName = useMemo(() =>
    {
        let newClassName = `grid gap-${ gap } overflow-auto`;

        if(className && className.length) newClassName += ' ' + className;

        return newClassName;
    }, [ className, gap ]);

    const getStyle = useMemo(() =>
    {
        const newStyle = { ...style };

        newStyle['--bs-columns'] = columns.toString();

        return newStyle;
    }, [ style, columns ]);

    return (
        <div className={ getClassName } style={ getStyle } { ...rest }>
            { children }
        </div>
    );
}
