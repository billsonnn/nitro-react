import { useVirtual } from '@tanstack/react-virtual';
import { FC, Fragment, ReactElement, useRef } from 'react';
import { Base } from './Base';

interface InfiniteScrollProps<T = any>
{
    rows: T[];
    estimateSize: number;
    overscan?: number;
    rowRender: (row: T) => ReactElement;
}

export const InfiniteScroll: FC<InfiniteScrollProps> = props =>
{
    const { rows = [], estimateSize = 0, overscan = 5, rowRender = null } = props;
    const elementRef = useRef<HTMLDivElement>(null);

    const rowVirtualizer = useVirtual({
        parentRef: elementRef,
        size: rows.length,
        overscan: 5
    });

    const { virtualItems, totalSize, } = rowVirtualizer;
    const paddingTop = (virtualItems.length > 0) ? (virtualItems?.[0]?.start || 0) : 0
    const paddingBottom = (virtualItems.length > 0) ? (totalSize - (virtualItems?.[virtualItems.length - 1]?.end || 0)) : 0;

    return (
        <Base fit innerRef={ elementRef } position="relative" overflow="auto">
            { (paddingTop > 0) &&
                <div
                    style={ { minHeight: `${ paddingTop }px` } } /> }
            { virtualItems.map(item => 
            {
                const row = rows[item.index];

                if (!row) return (
                    <Fragment
                        key={ item.key } />
                );

                return (
                    <div
                        key={ item.key }
                        data-index={ item.index }
                        ref={ item.measureRef }>
                        { rowRender(row) }
                    </div>
                )
            }) }
            { (paddingBottom > 0) &&
                <div
                    style={ { minHeight: `${ paddingBottom }px` } } /> }
        </Base>
    );
}
