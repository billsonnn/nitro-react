import { FC, useMemo } from 'react';
import { ItemCountView } from '../../views/shared/item-count/ItemCountView';
import { Column, ColumnProps } from '../Column';

export interface LayoutGridItemProps extends ColumnProps
{
    itemImage?: string;
    itemColor?: string;
    itemActive?: boolean;
    itemCount?: number;
    itemCountMinimum?: number;
    itemUniqueNumber?: number;
    itemUnseen?: boolean;
}

export const LayoutGridItem: FC<LayoutGridItemProps> = props =>
{
    const { itemImage = undefined, itemColor = undefined, itemActive = false, itemCount = 1, itemCountMinimum = 1, itemUniqueNumber = -2, itemUnseen = false, className = '', style = {}, classNames = [], position = 'relative', overflow = 'hidden', children = null, ...rest } = props;

    const getClassNames = useMemo(() =>
    {
        const newClassNames: string[] = [ 'layout-grid-item', 'border', 'border-2', 'border-muted', 'rounded' ];

        if(itemActive) newClassNames.push('active');

        if(itemUniqueNumber === -1) newClassNames.push('unique-item', 'sold-out');

        if(itemUniqueNumber > 0) newClassNames.push('unique-item');

        if(itemUnseen) newClassNames.push('unseen');

        if(itemImage === null) newClassNames.push('icon', 'loading-icon');

        if(classNames.length) newClassNames.push(...classNames);

        return newClassNames;
    }, [ itemActive, itemUniqueNumber, itemUnseen, itemImage, classNames ]);

    const getStyle = useMemo(() =>
    {
        const newStyle = { ...style };

        if(itemImage) newStyle.backgroundImage = `url(${ itemImage })`;

        if(itemColor) newStyle.backgroundColor = itemColor;

        return newStyle;
    }, [ style, itemImage, itemColor ]);

    return (
        <Column center pointer position={ position } overflow={ overflow } classNames={ getClassNames } style={ getStyle } { ...rest }>
            { (itemCount > itemCountMinimum) &&
                <ItemCountView count={ itemCount } /> }
            {/* { (itemUniqueNumber > 0) && 
                <div className="position-absolute unique-item-counter">
                    <LimitedEditionStyledNumberView value={ itemUniqueNumber } />
                </div> } */}
            { children }
        </Column>
    );
}
