import { FC, PropsWithChildren } from 'react';
import { UnseenItemCategory } from '../../../../api';
import { LayoutBadgeImageView, LayoutGridItem } from '../../../../common';
import { useInventoryBadges, useInventoryUnseenTracker } from '../../../../hooks';

export const InventoryBadgeItemView: FC<PropsWithChildren<{ badgeCode: string }>> = props =>
{
    const { badgeCode = null, children = null, ...rest } = props;
    const { selectedBadgeCode = null, setSelectedBadgeCode = null, toggleBadge = null, getBadgeId = null } = useInventoryBadges();
    const { isUnseen = null } = useInventoryUnseenTracker();
    const unseen = isUnseen(UnseenItemCategory.BADGE, getBadgeId(badgeCode));

    return (
        <LayoutGridItem itemActive={ (selectedBadgeCode === badgeCode) } itemUnseen={ unseen } onMouseDown={ event => setSelectedBadgeCode(badgeCode) } onDoubleClick={ event => toggleBadge(selectedBadgeCode) } { ...rest }>
            <LayoutBadgeImageView badgeCode={ badgeCode } />
            { children }
        </LayoutGridItem>
    );
}