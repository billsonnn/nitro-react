import { useVirtualizer } from '@tanstack/react-virtual';
import { DetailedHTMLProps, Fragment, HTMLAttributes, ReactElement, forwardRef, useEffect, useRef, useState } from 'react';
import { classNames } from './classNames';
import { styleNames } from './styleNames';

type Props<T> = {
    items: T[];
    columnCount: number;
    overscan?: number;
    estimateSize?: number;
    itemRender?: (item: T, index?: number) => ReactElement;
}

const InfiniteGridRoot = <T,>(props: Props<T>) =>
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
        const element = parentRef.current;

        if(!element || !items) return;

        const checkAndApplyPadding = () =>
        {
            if(!element) return;

            element.style.paddingRight = (element.scrollHeight > element.clientHeight) ? '0.25rem' : '0';
        }

        checkAndApplyPadding();

        window.addEventListener('resize', checkAndApplyPadding);

        return () =>
        {
            window.removeEventListener('resize', checkAndApplyPadding);
        }
    }, [ items ]);

    useEffect(() =>
    {
        if(!items || !items.length) return;

        virtualizer.scrollToIndex(0);
    }, [ items, virtualizer ]);

    const virtualItems = virtualizer.getVirtualItems();

    return (
        <div
            ref={ parentRef }
            className="overflow-y-auto size-full">
            <div
                className="flex flex-col w-full *:pb-1 relative"
                style={ {
                    height: virtualizer.getTotalSize()
                } }>
                { virtualItems.map(virtualRow => (
                    <div
                        key={ virtualRow.key + 'a' }
                        ref={ virtualizer.measureElement }
                        className={ `grid grid-cols-${ columnCount } gap-1 absolute top-0 left-0 h-[45px] last:pb-0 w-full` }
                        data-index={ virtualRow.index }
                        style={ {
                            transform: `translateY(${ virtualRow.start }px)`
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

const InfiniteGridItem = forwardRef<HTMLDivElement, {
    itemImage?: string;
    itemColor?: string;
    itemActive?: boolean;
    itemCount?: number;
    itemCountMinimum?: number;
    itemUniqueSoldout?: boolean;
    itemUniqueNumber?: number;
    itemUnseen?: boolean;
    itemHighlight?: boolean;
    disabled?: boolean;
} & DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>>((props, ref) =>
{
    const { itemImage = undefined, itemColor = undefined, itemActive = false, itemCount = 1, itemCountMinimum = 1, itemUniqueSoldout = false, itemUniqueNumber = -2, itemUnseen = false, itemHighlight = false, disabled = false, className = null, style = {}, children = null, ...rest } = props;
    const [ backgroundImageUrl, setBackgroundImageUrl ] = useState<string>(null);
    const disposed = useRef<boolean>(false);

    useEffect(() =>
    {
        if(!itemImage || !itemImage.length) return;

        const image = new Image();

        image.onload = () =>
        {
            if(disposed.current) return;

            setBackgroundImageUrl(image.src);
        }

        image.src = itemImage;
    }, [ itemImage ]);

    useEffect(() =>
    {
        disposed.current = false;

        return () =>
        {
            disposed.current = true;
        }
    }, []);

    return (
        <div
            ref={ ref }
            className={ classNames(
                'flex flex-col items-center justify-center cursor-pointer overflow-hidden relative bg-center bg-no-repeat w-full rounded-md border-2',
                (!backgroundImageUrl || !backgroundImageUrl.length) && 'nitro-icon icon-loading',
                itemActive ? 'border-card-grid-item-active bg-card-grid-item-active' : 'border-card-grid-item-border bg-card-grid-item',
                className
            ) }
            style={ styleNames(
                backgroundImageUrl && backgroundImageUrl.length && !(itemUniqueSoldout || (itemUniqueNumber > 0)) && {
                    backgroundImage: `url(${ backgroundImageUrl })`
                },
                style
            ) }
            { ...rest }>
            { children }
        </div>
    );
});

InfiniteGridItem.displayName = 'InfiniteGridItem';

export const InfiniteGrid = Object.assign(InfiniteGridRoot, {
    Item: InfiniteGridItem
});
