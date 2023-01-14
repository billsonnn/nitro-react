import { useVirtual } from '@tanstack/react-virtual';
import { FC, Fragment, ReactElement, useEffect, useRef, useState } from 'react';
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
    const elementRef = useRef<HTMLDivElement>(null);

    const { virtualItems = [], totalSize = 0, scrollToIndex = null } = useVirtual({
        parentRef: elementRef,
        size: rows.length,
        overscan
    });

    const paddingTop = (virtualItems.length > 0) ? (virtualItems?.[0]?.start || 0) : 0
    const paddingBottom = (virtualItems.length > 0) ? (totalSize - (virtualItems?.[virtualItems.length - 1]?.end || 0)) : 0;

    useEffect(() =>
    {
        if(!scrollToBottom) return;

        scrollToIndex(scrollIndex);
    }, [ scrollToBottom, scrollIndex, scrollToIndex ]);

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
