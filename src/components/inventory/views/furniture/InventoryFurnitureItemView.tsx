import { MouseEventType } from '@nitrots/nitro-renderer';
import { FC, MouseEvent, useEffect, useState } from 'react';
import { LayoutGridItem } from '../../../../common/layout/LayoutGridItem';
import { attemptItemPlacement } from '../../common/FurnitureUtilities';
import { GroupItem } from '../../common/GroupItem';
import { useInventoryContext } from '../../InventoryContext';
import { InventoryFurnitureActions } from '../../reducers/InventoryFurnitureReducer';

export interface InventoryFurnitureItemViewProps
{
    groupItem: GroupItem;
}

export const InventoryFurnitureItemView: FC<InventoryFurnitureItemViewProps> = props =>
{
    const { groupItem } = props;
    const [ isMouseDown, setMouseDown ] = useState(false);
    const { furnitureState, dispatchFurnitureState } = useInventoryContext();
    const isActive = (furnitureState.groupItem === groupItem);

    const onMouseEvent = (event: MouseEvent) =>
    {
        switch(event.type)
        {
            case MouseEventType.MOUSE_DOWN:
                dispatchFurnitureState({
                    type: InventoryFurnitureActions.SET_GROUP_ITEM,
                    payload: { groupItem }
                });

                setMouseDown(true);
                return;
            case MouseEventType.MOUSE_UP:
                setMouseDown(false);
                return;
            case MouseEventType.ROLL_OUT:
                if(!isMouseDown || !isActive) return;

                attemptItemPlacement(groupItem);
                return;
        }
    }

    useEffect(() =>
    {
        if(!isActive) return;

        groupItem.hasUnseenItems = false;
    }, [ isActive, groupItem ]);

    const count = groupItem.getUnlockedCount();

    return <LayoutGridItem className={ !count ? 'opacity-0-5 ' : '' } itemImage={ groupItem.iconUrl } itemCount={ count } itemActive={ isActive } itemUniqueNumber={ groupItem.stuffData.uniqueNumber } itemUnseen={ groupItem.hasUnseenItems } onMouseDown={ onMouseEvent } onMouseUp={ onMouseEvent } onMouseOut={ onMouseEvent } />;
}
