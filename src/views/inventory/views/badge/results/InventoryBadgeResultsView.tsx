import { FC } from 'react';
import { InventoryBadgeItemView } from '../item/InventoryBadgeItemView';
import { InventoryBadgeResultsViewProps } from './InventoryBadgeResultsView.types';

export const InventoryBadgeResultsView: FC<InventoryBadgeResultsViewProps> = props =>
{
    const { badges = [], activeBadges = [] } = props;
    
    return (
        <div className="h-100 overflow-hidden">
            <div className="row row-cols-5 align-content-start g-0 w-100 h-100 overflow-auto">
            { badges && (badges.length > 0) && badges.map(code =>
                    {
                        if(activeBadges.indexOf(code) >= 0) return null;
                        
                        return <InventoryBadgeItemView key={ code } badge={ code } />
                    }) }
            </div>
        </div>
    );
}
