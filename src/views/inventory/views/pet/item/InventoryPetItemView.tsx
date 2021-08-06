import { MouseEventType } from '@nitrots/nitro-renderer';
import { FC, MouseEvent, useCallback, useEffect, useState } from 'react';
import { NitroCardGridItemView } from '../../../../../layout/card/grid/item/NitroCardGridItemView';
import { PetImageView } from '../../../../shared/pet-image/PetImageView';
import { attemptPetPlacement } from '../../../common/PetUtilities';
import { useInventoryContext } from '../../../context/InventoryContext';
import { InventoryPetActions } from '../../../reducers/InventoryPetReducer';
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

    useEffect(() =>
    {
        if(!isActive) return;

        petItem.isUnseen = false;
    }, [ isActive, petItem ]);
    
    return (
        <NitroCardGridItemView itemActive={ isActive } itemUnseen={ petItem.isUnseen } onMouseDown={ onMouseEvent } onMouseUp={ onMouseEvent } onMouseOut={ onMouseEvent }>
            <PetImageView figure={ petItem.petData.figureString } direction={ 3 } headOnly={ true } />
        </NitroCardGridItemView>
    );
}
