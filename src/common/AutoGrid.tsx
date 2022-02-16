import { CSSProperties, FC, useMemo } from 'react';
import { Grid, GridProps } from './Grid';

export interface AutoGridProps extends GridProps
{
    columnMinWidth?: number;
    columnMinHeight?: number;
}

export const AutoGrid: FC<AutoGridProps> = props =>
{
    const { columnMinWidth = 40, columnMinHeight = 40, columnCount = 0, fullHeight = false, maxContent = true, overflow = 'auto', style = {}, ...rest } = props;

    const getStyle = useMemo(() =>
    {
        let newStyle: CSSProperties = {};

        newStyle['--nitro-grid-column-min-height'] = (columnMinHeight + 'px');
        
        if(columnCount > 1) newStyle.gridTemplateColumns = `repeat(auto-fill, minmax(${ columnMinWidth }px, 1fr))`;

        if(Object.keys(style).length) newStyle = { ...newStyle, ...style };

        return newStyle;
    }, [ columnMinWidth, columnMinHeight, columnCount, style ]);

    return <Grid columnCount={ columnCount } fullHeight={ fullHeight } overflow={ overflow } style={ getStyle } { ...rest } />;
}
