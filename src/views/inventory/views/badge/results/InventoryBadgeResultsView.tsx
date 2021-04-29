import { FC } from 'react';
import { InventoryBadgeItemView } from '../item/InventoryBadgeItemView';
import { InventoryBadgeResultsViewProps } from './InventoryBadgeResultsView.types';

export const InventoryBadgeResultsView: FC<InventoryBadgeResultsViewProps> = props =>
{
    const { badges = [], cols = 5 } = props;
    
    return (
        <div className={ 'row row-cols-' + cols + ' align-content-start g-0 badge-item-container' }>
            { (badges && badges.length && badges.map((code, index) =>
                {
                    return <InventoryBadgeItemView key={ index } badge={ code } />
                })) || null }
        </div>
    );
}
