import { FC } from 'react';
import { InventoryBadgeItemView } from '../item/InventoryBadgeItemView';
import { InventoryBadgeResultsViewProps } from './InventoryBadgeResultsView.types';

export const InventoryBadgeResultsView: FC<InventoryBadgeResultsViewProps> = props =>
{
    const { badges = [], activeBadges = [] } = props;
    
    return (
        <div className="row row-cols-5 align-content-start g-0 badge-item-container">
            { (badges && badges.length && badges.map((code, index) =>
                {
                    if(activeBadges.indexOf(code) >= 0) return null;
                    
                    return <InventoryBadgeItemView key={ index } badge={ code } />
                })) || null }
        </div>
    );
}
