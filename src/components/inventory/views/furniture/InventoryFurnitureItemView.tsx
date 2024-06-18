import { MouseEventType } from '@nitrots/nitro-renderer';
import { FC, MouseEvent, useState } from 'react';
import { GroupItem, attemptItemPlacement } from '../../../../api';
import { useInventoryFurni } from '../../../../hooks';
import { InfiniteGrid, classNames } from '../../../../layout';

export const InventoryFurnitureItemView: FC<{
    groupItem: GroupItem
}> = props =>
{
    const { groupItem = null, ...rest } = props;
    const [ isMouseDown, setMouseDown ] = useState(false);
    const { selectedItem = null, setSelectedItem = null } = useInventoryFurni();

    const onMouseEvent = (event: MouseEvent) =>
    {
        switch(event.type)
        {
            case MouseEventType.MOUSE_DOWN:
                setSelectedItem(groupItem);
                setMouseDown(true);
                return;
            case MouseEventType.MOUSE_UP:
                setMouseDown(false);
                return;
            case MouseEventType.ROLL_OUT:
                if(!isMouseDown || !(groupItem === selectedItem)) return;

                attemptItemPlacement(groupItem);
                return;
            case 'dblclick':
                attemptItemPlacement(groupItem);
                return;
        }
    };

    const count = groupItem.getUnlockedCount();

    return <InfiniteGrid.Item className={ classNames(!count && 'opacity-50') } itemActive={ (groupItem === selectedItem) } itemCount={ groupItem.getUnlockedCount() } itemImage={ groupItem.iconUrl } itemUniqueNumber={ groupItem.stuffData.uniqueNumber } itemUnseen={ groupItem.hasUnseenItems } onDoubleClick={ onMouseEvent } onMouseDown={ onMouseEvent } onMouseOut={ onMouseEvent } onMouseUp={ onMouseEvent } />;
};
