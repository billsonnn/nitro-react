import { MouseEventType } from 'nitro-renderer';
import { FC, MouseEvent, useCallback, useState } from 'react';
import { PetImageView } from '../../../../pet-image/PetImageView';
import { useInventoryContext } from '../../../context/InventoryContext';
import { InventoryPetActions } from '../../../reducers/InventoryPetReducer';
import { attemptPetPlacement } from '../../../utils/PetUtilities';
import { InventoryPetItemViewProps } from './InventoryPetItemView.types';

export const InventoryPetItemView: FC<InventoryPetItemViewProps> = props =>
{
    const { petItem } = props;
    const { petState = null, dispatchPetState = null } = useInventoryContext();
    const [ isMouseDown, setMouseDown ] = useState(false);
    const isActive = (petState.petItem === petItem);

    const onMouseEvent = useCallback((event: MouseEvent) =>
    {
        switch(event.type)
        {
            case MouseEventType.MOUSE_DOWN:
                dispatchPetState({
                    type: InventoryPetActions.SET_PET_ITEM,
                    payload: { petItem }
                });

                setMouseDown(true);
                return;
            case MouseEventType.MOUSE_UP:
                setMouseDown(false);
                return;
            case MouseEventType.ROLL_OUT:
                if(!isMouseDown || !isActive) return;

                attemptPetPlacement(petItem);
                return;
        }
    }, [ isActive, isMouseDown, petItem, dispatchPetState ]);

    return (
        <div className="col pe-1 pb-1 inventory-pet-item-container">
            <div className={ 'position-relative border border-2 rounded inventory-pet-item cursor-pointer ' + (isActive ? 'active' : '') } onMouseDown={ onMouseEvent } onMouseUp={ onMouseEvent } onMouseOut={ onMouseEvent }>
                <PetImageView figure={ petItem.petData.figureData.figuredata } direction={ 3 } headOnly={ true } />
            </div>
        </div>
    );
}