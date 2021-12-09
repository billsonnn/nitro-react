import { MouseEventType } from '@nitrots/nitro-renderer';
import { FC, MouseEvent, useCallback } from 'react';
import { NitroCardGridItemView } from '../../../../layout/card/grid/item/NitroCardGridItemView';
import { BadgeImageView } from '../../../../views/shared/badge-image/BadgeImageView';
import { useInventoryContext } from '../../context/InventoryContext';
import { InventoryBadgeActions } from '../../reducers/InventoryBadgeReducer';

export interface InventoryBadgeItemViewProps
{
    badgeCode: string;
}

export const InventoryBadgeItemView: FC<InventoryBadgeItemViewProps> = props =>
{
    const { badgeCode = null } = props;
    const { badgeState = null, dispatchBadgeState = null } = useInventoryContext();

    const onMouseEvent = useCallback((event: MouseEvent) =>
    {
        switch(event.type)
        {
            case MouseEventType.MOUSE_DOWN:
                dispatchBadgeState({
                    type: InventoryBadgeActions.SET_BADGE,
                    payload: { badgeCode }
                });
        }
    }, [ badgeCode, dispatchBadgeState ]);

    return (
        <NitroCardGridItemView itemActive={ (badgeState.badge === badgeCode) } onMouseDown={ onMouseEvent }> 
            <BadgeImageView badgeCode={ badgeCode } />
        </NitroCardGridItemView>
    );
}
