import { MouseEventType } from 'nitro-renderer';
import { FC, MouseEvent, useCallback, useState } from 'react';
import { LimitedEditionStyledNumberView } from '../../../../shared/limited-edition/styled-number/LimitedEditionStyledNumberView';
import { attemptItemPlacement } from '../../../common/FurnitureUtilities';
import { useInventoryContext } from '../../../context/InventoryContext';
import { InventoryFurnitureActions } from '../../../reducers/InventoryFurnitureReducer';
import { InventoryFurnitureItemViewProps } from './InventoryFurnitureItemView.types';

export const InventoryFurnitureItemView: FC<InventoryFurnitureItemViewProps> = props =>
{
    const { groupItem } = props;
    const { furnitureState, dispatchFurnitureState } = useInventoryContext();
    const { tradeData = null } = furnitureState;
    const [ isMouseDown, setMouseDown ] = useState(false);
    const isActive = (furnitureState.groupItem === groupItem);

    const onMouseEvent = useCallback((event: MouseEvent) =>
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
    }, [ isActive, isMouseDown, groupItem, dispatchFurnitureState ]);

    const imageUrl = `url(${ groupItem.iconUrl })`;

    return (
        <div className="col pe-1 pb-1 inventory-furniture-item-container">
            <div className={ 'position-relative border border-2 rounded inventory-furniture-item cursor-pointer ' + (isActive ? 'active ' : '') + (groupItem.stuffData.isUnique ? 'unique-item ' : '') + (!groupItem.getUnlockedCount() ? 'opacity-0-5 ' : '') } style={ { backgroundImage: imageUrl }} onMouseDown={ onMouseEvent } onMouseUp={ onMouseEvent } onMouseOut={ onMouseEvent }>
                {groupItem.getUnlockedCount() > 1 &&
                    <span className="position-absolute badge border bg-danger px-1 rounded-circle">{groupItem.getUnlockedCount()}</span> }
                { groupItem.stuffData.isUnique && 
                    <div className="position-absolute unique-item-counter">
                        <LimitedEditionStyledNumberView value={ groupItem.stuffData.uniqueNumber } />
                    </div> }
            </div>
        </div>
    );
}
