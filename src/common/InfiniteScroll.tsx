import { useVirtualizer } from '@tanstack/react-virtual';
import { FC, ReactElement, useEffect, useRef } from 'react';
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

    const rowVirtualizer = useVirtualizer({
        count: rows.length,
        getScrollElement: () => elementRef?.current,
        estimateSize: () => estimateSize,
        overscan: overscan
    });

    useEffect(() =>
    {
        let timeout: ReturnType<typeof setTimeout> = null;

        const resizeObserver = new ResizeObserver(() =>
        {
            if(timeout) clearTimeout(timeout);

            if(!elementRef.current) return;

            timeout = setTimeout(() => rowVirtualizer.getVirtualItems().forEach((virtualItem, index) => virtualItem.measureElement(elementRef?.current?.children?.[0]?.children[index])), 10);
        });

        if(elementRef.current) resizeObserver.observe(elementRef.current);

        return () =>
        {
            if(timeout) clearTimeout();

            timeout = null;
            
            resizeObserver.disconnect();
        }
    }, [ rowVirtualizer ]);

    return (
        <Base fit innerRef={ elementRef } position="relative" overflow="auto">
            <Base style={ { height: rowVirtualizer.getTotalSize() } }>
                { rowVirtualizer.getVirtualItems().map(virtualRow =>
                {
                    return (
                        <div key={ virtualRow.index } ref={ virtualRow.measureElement } style={ { transform: `translateY(${ virtualRow.start }px)`, position: 'absolute', width: '100%' } }>
                            { rowRender(rows[virtualRow.index]) }
                        </div>
                    );
                }) }
            </Base>
        </Base>
    );
}
