import { FC } from 'react';
import { InventoryBadgeItemView } from '../item/InventoryBadgeItemView';
import { InventoryActiveBadgeResultsViewProps } from './InventoryActiveBadgeResultsView.types';

export const InventoryActiveBadgeResultsView: FC<InventoryActiveBadgeResultsViewProps> = props =>
{
    const { badges = [] } = props;
    
    return (
        <div className="row row-cols-3 align-content-start g-0">
            { badges && (badges.length > 0) && badges.map(code =>
                {
                    return <InventoryBadgeItemView key={ code } badge={ code } />
                }) }
        </div>
    );
}
