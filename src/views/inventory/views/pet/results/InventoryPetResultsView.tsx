import { FC } from 'react';
import { NitroCardGridView } from '../../../../../layout/card/grid/NitroCardGridView';
import { InventoryPetItemView } from '../item/InventoryPetItemView';
import { InventoryPetResultsViewProps } from './InventoryPetResultsView.types';

export const InventoryPetResultsView: FC<InventoryPetResultsViewProps> = props =>
{
    const { petItems = [] } = props;
    
    return (
        <NitroCardGridView>
            { petItems && (petItems.length > 0) && petItems.map(item =>
                {
                    return <InventoryPetItemView key={ item.id } petItem={ item } />
                }) }
        </NitroCardGridView>
    );
}
