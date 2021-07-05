import { FC, useCallback } from 'react';
import { LimitedEditionStyledNumberView } from '../../../../shared/limited-edition/styled-number/LimitedEditionStyledNumberView';
import { InventoryTradeItemViewProps } from './InventoryTradeItemView.types';

export const InventoryTradeItemView: FC<InventoryTradeItemViewProps> = props =>
{
    const { groupItem = null } = props;

    const onClick = useCallback(() =>
    {

    }, []);

    if(!groupItem)
    {
        return (
            <div className="col pe-1 pb-1 inventory-furniture-item-container">
                <div className="position-relative border border-2 rounded inventory-furniture-item cursor-pointer" />
            </div>
        );
    }

    const imageUrl = `url(${ groupItem.iconUrl })`;

    return (
        <div className="col pe-1 pb-1 inventory-furniture-item-container">
            <div className="position-relative border border-2 rounded inventory-furniture-item cursor-pointer" style={ { backgroundImage: imageUrl }} onClick={ onClick }>
                { groupItem.getUnlockedCount() > 1 &&
                    <span className="position-absolute badge border bg-danger px-1 rounded-circle">{ groupItem.getUnlockedCount() }</span> }
                { groupItem.stuffData.isUnique && 
                    <div className="position-absolute unique-item-counter">
                        <LimitedEditionStyledNumberView value={ groupItem.stuffData.uniqueNumber } />
                    </div> }
            </div>
        </div>
    );
}
