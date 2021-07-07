import { MouseEventType } from 'nitro-renderer';
import { FC, MouseEvent, useCallback } from 'react';
import { NitroCardGridItemView } from '../../../../../layout/card/grid/item/NitroCardGridItemView';
import { BadgeImageView } from '../../../../shared/badge-image/BadgeImageView';
import { useInventoryContext } from '../../../context/InventoryContext';
import { InventoryBadgeActions } from '../../../reducers/InventoryBadgeReducer';
import { InventoryBadgeItemViewProps } from './InventoryBadgeItemView.types';

export const InventoryBadgeItemView: FC<InventoryBadgeItemViewProps> = props =>
{
    const { badge } = props;
    const { badgeState = null, dispatchBadgeState = null } = useInventoryContext();
    const isActive = (badgeState.badge === badge);

    const onMouseEvent = useCallback((event: MouseEvent) =>
    {
        switch(event.type)
        {
            case MouseEventType.MOUSE_DOWN:
                dispatchBadgeState({
                    type: InventoryBadgeActions.SET_BADGE,
                    payload: { badgeCode: badge }
                });
        }
    }, [ badge, dispatchBadgeState ]);

    return (
        <NitroCardGridItemView itemActive={ isActive }>
            <BadgeImageView badgeCode={ badge } />
        </NitroCardGridItemView>
    );
}
