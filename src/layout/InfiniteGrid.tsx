import { useVirtualizer } from '@tanstack/react-virtual';
import { Fragment, ReactElement, useEffect, useRef } from 'react';

type Props<T> = {
    items: T[];
    columnCount: number;
    overscan?: number;
    estimateSize?: number;
    itemRender?: (item: T, index?: number) => ReactElement;
}

export const InfiniteGrid = <T,>(props: Props<T>) =>
{
    const { items = [], columnCount = 4, overscan = 5, estimateSize = 45, itemRender = null } = props;
    const parentRef = useRef<HTMLDivElement>(null);

    const virtualizer = useVirtualizer({
        count: Math.ceil(items.length / columnCount),
        overscan,
        getScrollElement: () => parentRef.current,
        estimateSize: () => estimateSize
    });

    useEffect(() =>
    {
        if(!items || !items.length) return;

        virtualizer.scrollToIndex(0);
    }, [ items, virtualizer ]);

    const virtualItems = virtualizer.getVirtualItems();

    return (
        <div ref={ parentRef } className="size-full position-relative" style={ { overflowY: 'auto', height: virtualizer.getTotalSize() } }>
            <div
                className="flex flex-col w-full gap-1"
                style={ {
                    transform: `translateY(${ virtualItems[0]?.start ?? 0 }px)`
                } }>
                { virtualItems.map(virtualRow => (
                    <div
                        key={ virtualRow.key + 'a' }
                        ref={ virtualizer.measureElement }
                        className="grid grid-cols-12 gap-2 "
                        data-index={ virtualRow.index }
                        style={ {
                            display: 'grid',
                            gap: '0.25rem',
                            minHeight: virtualRow.index === 0 ? estimateSize : virtualRow.size,
                            gridTemplateColumns: `repeat(${ columnCount }, 1fr)`
                        } }>
                        { Array.from(Array(columnCount)).map((e,i) => 
                        {
                            const item = items[i + (virtualRow.index * columnCount)];

                            if(!item) return <Fragment
                                key={ virtualRow.index + i + 'b' } />;

                            return (
                                <Fragment key={ i }>
                                    { itemRender(item, i) }
                                </Fragment>
                            );
                        }) }
                    </div>
                )) }
            </div>
        </div>
    );
}
