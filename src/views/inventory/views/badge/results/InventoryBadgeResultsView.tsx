import { FC } from 'react';
import { NitroCardGridView } from '../../../../../layout/card/grid/NitroCardGridView';
import { InventoryBadgeItemView } from '../item/InventoryBadgeItemView';
import { InventoryBadgeResultsViewProps } from './InventoryBadgeResultsView.types';

export const InventoryBadgeResultsView: FC<InventoryBadgeResultsViewProps> = props =>
{
    const { badges = [], activeBadges = [] } = props;
    
    return (
        <NitroCardGridView>
            { badges && (badges.length > 0) && badges.map(code =>
                {
                    if(activeBadges.indexOf(code) >= 0) return null;
                    
                    return <InventoryBadgeItemView key={ code } badge={ code } />
                }) }
        </NitroCardGridView>
    );
}
