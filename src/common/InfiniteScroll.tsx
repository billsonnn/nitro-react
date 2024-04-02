import { useVirtualizer } from '@tanstack/react-virtual';
import { FC, ReactElement, useRef, useState } from 'react';
import { Base } from './Base';

interface InfiniteScrollProps<T = any>
{
    rows: T[];
    overscan?: number;
    scrollToBottom?: boolean;
    rowRender: (row: T) => ReactElement;
}

export const InfiniteScroll: FC<InfiniteScrollProps> = props =>
{
    const { rows = [], overscan = 5, scrollToBottom = false, rowRender = null } = props;
    const [ scrollIndex, setScrollIndex ] = useState<number>(rows.length - 1);
    const parentRef = useRef<HTMLDivElement>(null);

    const virtualizer = useVirtualizer({
        count: rows.length,
        overscan,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 45,
    });
    const items = virtualizer.getVirtualItems();

    return (
        <Base fit innerRef={ parentRef } position="relative" overflow="auto">
            <div
                style={ {
                    height: virtualizer.getTotalSize(),
                    width: '100%',
                    position: 'relative'
                } }>
                <div
                    style={ {
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        transform: `translateY(${ items[0]?.start ?? 0 }px)`
                    } }>
                    { items.map((virtualRow) => (
                        <div
                            key={ virtualRow.key }
                            data-index={ virtualRow.index }
                            ref={ virtualizer.measureElement }>
                            { rowRender(rows[virtualRow.index]) }
                        </div>
                    )) }
                </div>
            </div>
        </Base>
    );
}
