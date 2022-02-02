import { MouseEventType } from '@nitrots/nitro-renderer';
import { FC, MouseEvent, useEffect, useState } from 'react';
import { LayoutGridItem } from '../../../../common/layout/LayoutGridItem';
import { PetImageView } from '../../../../views/shared/pet-image/PetImageView';
import { PetItem } from '../../common/PetItem';
import { attemptPetPlacement } from '../../common/PetUtilities';
import { useInventoryContext } from '../../InventoryContext';
import { InventoryPetActions } from '../../reducers/InventoryPetReducer';

export interface InventoryPetItemViewProps
{
    petItem: PetItem;
}

export const InventoryPetItemView: FC<InventoryPetItemViewProps> = props =>
{
    const { petItem } = props;
    const [ isMouseDown, setMouseDown ] = useState(false);
    const { petState = null, dispatchPetState = null } = useInventoryContext();
    const isActive = (petState.petItem === petItem);

    const onMouseEvent = (event: MouseEvent) =>
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
    }

    useEffect(() =>
    {
        if(!isActive) return;

        petItem.isUnseen = false;
    }, [ isActive, petItem ]);
    
    return (
        <LayoutGridItem itemActive={ isActive } itemUnseen={ petItem.isUnseen } onMouseDown={ onMouseEvent } onMouseUp={ onMouseEvent } onMouseOut={ onMouseEvent }>
            <PetImageView figure={ petItem.petData.figureData.figuredata } direction={ 3 } headOnly={ true } />
        </LayoutGridItem>
    );
}
