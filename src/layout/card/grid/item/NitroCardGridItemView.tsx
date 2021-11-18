import { FC, useMemo } from 'react';
import { ItemCountView } from '../../../../views/shared/item-count/ItemCountView';
import { LimitedEditionStyledNumberView } from '../../../../views/shared/limited-edition/styled-number/LimitedEditionStyledNumberView';
import { NitroCardGridItemViewProps } from './NitroCardGridItemView.types';

export const NitroCardGridItemView: FC<NitroCardGridItemViewProps> = props =>
{
    const { itemImage = undefined, itemColor = undefined, itemActive = false, itemCount = 1, itemCountMinimum = 1, itemUniqueNumber = -2, itemUnseen = false, className = '', style = {}, children = null, ...rest } = props;

    const getClassName = useMemo(() =>
    {
        let newClassName = 'grid-item gap-1 cursor-pointer overflow-hidden';

        if(itemActive) newClassName += ' active';

        if(itemUniqueNumber === -1) newClassName += ' unique-item sold-out';

        if(itemUniqueNumber > 0) newClassName += ' unique-item';

        if(itemUnseen) newClassName += ' unseen';

        if(itemImage === null) newClassName += ' icon loading-icon';

        if(className && className.length) newClassName += ' ' + className;

        return newClassName;
    }, [ className, itemActive, itemUniqueNumber, itemUnseen, itemImage ]);

    const getStyle = useMemo(() =>
    {
        const newStyle = { ...style };

        if(itemImage) newStyle.backgroundImage = `url(${ itemImage })`;

        if(itemColor) newStyle.backgroundColor = itemColor;

        return newStyle;
    }, [ style, itemImage, itemColor ]);

    return (
        <div className={ getClassName } style={ getStyle } { ...rest }>
            { (itemCount > itemCountMinimum) &&
                <ItemCountView count={ itemCount } /> }
            { (itemUniqueNumber > 0) && 
                <div className="position-absolute unique-item-counter">
                    <LimitedEditionStyledNumberView value={ itemUniqueNumber } />
                </div> }
            { children }
        </div>
    );
}
