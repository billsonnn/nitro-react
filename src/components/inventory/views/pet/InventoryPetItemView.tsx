import { MouseEventType } from '@nitrots/nitro-renderer';
import { FC, MouseEvent, PropsWithChildren, useState } from 'react';
import { IPetItem, UnseenItemCategory, attemptPetPlacement } from '../../../../api';
import { LayoutPetImageView } from '../../../../common';
import { useInventoryPets, useInventoryUnseenTracker } from '../../../../hooks';
import { InfiniteGrid } from '../../../../layout';

export const InventoryPetItemView: FC<PropsWithChildren<{ petItem: IPetItem }>> = props =>
{
    const { petItem = null, children = null, ...rest } = props;
    const [ isMouseDown, setMouseDown ] = useState(false);
    const { selectedPet = null, setSelectedPet = null } = useInventoryPets();
    const { isUnseen } = useInventoryUnseenTracker();
    const unseen = isUnseen(UnseenItemCategory.PET, petItem.petData.id);

    const onMouseEvent = (event: MouseEvent) =>
    {
        switch(event.type)
        {
            case MouseEventType.MOUSE_DOWN:
                setSelectedPet(petItem);
                setMouseDown(true);
                return;
            case MouseEventType.MOUSE_UP:
                setMouseDown(false);
                return;
            case MouseEventType.ROLL_OUT:
                if(!isMouseDown || !(petItem === selectedPet)) return;

                attemptPetPlacement(petItem);
                return;
            case 'dblclick':
                attemptPetPlacement(petItem);
                return;
        }
    };

    return (
        <InfiniteGrid.Item itemActive={ (petItem === selectedPet) } itemUnseen={ unseen } onDoubleClick={ onMouseEvent } onMouseDown={ onMouseEvent } onMouseOut={ onMouseEvent } onMouseUp={ onMouseEvent } { ...rest }>
            <LayoutPetImageView direction={ 3 } figure={ petItem.petData.figureData.figuredata } headOnly={ true } />
            { children }
        </InfiniteGrid.Item>
    );
};
