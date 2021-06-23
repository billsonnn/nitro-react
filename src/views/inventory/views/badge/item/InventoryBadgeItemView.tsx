import { MouseEventType } from 'nitro-renderer';
import { FC, MouseEvent, useCallback } from 'react';
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
        <div className="col pe-1 pb-1 inventory-badge-item-container">
            <div className={ 'position-relative border border-2 rounded inventory-badge-item cursor-pointer ' + (isActive ? 'active' : '') } onMouseDown={ onMouseEvent }>
                <BadgeImageView badgeCode={ badge } />
            </div>
        </div>
    );
}
