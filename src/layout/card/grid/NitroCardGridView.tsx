import { FC, useMemo } from 'react';
import { NitroCardGridViewProps } from './NitroCardGridView.types';

export const NitroCardGridView: FC<NitroCardGridViewProps> = props =>
{
    const { columns = 0, gap = 2, className = '', style = null, children = null, ...rest } = props;

    const getClassName = useMemo(() =>
    {
        let newClassName = `grid gap-${ gap } nitro-grid overflow-auto`;

        if(className && className.length) newClassName += ' ' + className;

        return newClassName;
    }, [ className, gap ]);

    const getStyle = useMemo(() =>
    {
        const newStyle = { ...style };

        if(columns && (columns >= 1))
        {
            newStyle.gridTemplateColumns = 'unset';
            newStyle['--bs-columns'] = columns.toString();
        }

        return newStyle;
    }, [ style, columns ]);

    return (
        <div className={ getClassName } style={ getStyle } { ...rest }>
            { children }
        </div>
    );
}
