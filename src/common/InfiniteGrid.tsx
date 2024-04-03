import { useVirtualizer } from '@tanstack/react-virtual';
import { FC, Fragment, ReactElement, useEffect, useRef } from 'react';
import { Base } from './Base';
import { Flex } from './Flex';

interface InfiniteGridProps<T = any>
{
    rows: T[];
    columnCount: number;
    overscan?: number;
    estimateSize?: number;
    itemRender?: (item: T, index?: number) => ReactElement;
}

export const InfiniteGrid: FC<InfiniteGridProps> = props =>
{
    const { rows = [], columnCount = 4, overscan = 5, estimateSize = 45, itemRender = null } = props;
    const parentRef = useRef<HTMLDivElement>(null);

    const virtualizer = useVirtualizer({
        count: Math.ceil(rows.length / columnCount),
        overscan,
        getScrollElement: () => parentRef.current,
        estimateSize: () => estimateSize
    });

    useEffect(() =>
    {
        if(!rows || !rows.length) return;

        virtualizer.scrollToIndex(0);
    }, [ rows, virtualizer ]);

    const items = virtualizer.getVirtualItems();

    return (
        <Base innerRef={ parentRef } fit position="relative" style={ { overflowY: 'auto' } }>
            <div
                style={ {
                    height: virtualizer.getTotalSize(),
                    width: '100%',
                    position: 'relative'
                } }>
                <Flex
                    column
                    gap={ 1 }
                    style={ {
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        transform: `translateY(${ items[0]?.start ?? 0 }px)`
                    } }>
                    { items.map(virtualRow => (
                        <div
                            key={ virtualRow.key + 'a' }
                            data-index={ virtualRow.index }
                            ref={ virtualizer.measureElement }
                            style={ {
                                display: 'grid',
                                gap: '0.25rem',
                                minHeight: virtualRow.index === 0 ? estimateSize : virtualRow.size,
                                gridTemplateColumns: `repeat(${ columnCount }, 1fr)`
                            } }>
                            { Array.from(Array(columnCount)).map((e,i) => 
                            {
                                const item = rows[i + (virtualRow.index * columnCount)];

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
                </Flex>
            </div>
        </Base>
    );
}
