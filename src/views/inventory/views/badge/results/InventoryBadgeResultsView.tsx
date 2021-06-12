import { FC } from 'react';
import { ScrollableAreaView } from '../../../../../layout/scrollable-area/ScrollableAreaView';
import { InventoryBadgeItemView } from '../item/InventoryBadgeItemView';
import { InventoryBadgeResultsViewProps } from './InventoryBadgeResultsView.types';

export const InventoryBadgeResultsView: FC<InventoryBadgeResultsViewProps> = props =>
{
    const { badges = [], activeBadges = [] } = props;
    
    return (
        <div className="d-flex flex-grow-1">
            <ScrollableAreaView className="row row-cols-5 align-content-start g-0 w-100">
                { badges && (badges.length > 0) && badges.map((code, index) =>
                    {
                        if(activeBadges.indexOf(code) >= 0) return null;
                        
                        return <InventoryBadgeItemView key={ index } badge={ code } />
                    }) }
            </ScrollableAreaView>
        </div>
    );
}
