import { FC } from 'react';
import { NitroCardGridView } from '../../../../../layout/card/grid/NitroCardGridView';
import { InventoryBadgeItemView } from '../item/InventoryBadgeItemView';
import { InventoryActiveBadgeResultsViewProps } from './InventoryActiveBadgeResultsView.types';

export const InventoryActiveBadgeResultsView: FC<InventoryActiveBadgeResultsViewProps> = props =>
{
    const { badges = [] } = props;
    
    return (
        <NitroCardGridView>
            { badges && (badges.length > 0) && badges.map(code =>
                {
                    return <InventoryBadgeItemView key={ code } badge={ code } />
                }) }
        </NitroCardGridView>
    );
}
