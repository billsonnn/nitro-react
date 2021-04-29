import { FC } from 'react';
import { InventoryPetItemView } from '../item/InventoryPetItemView';
import { InventoryPetResultsViewProps } from './InventoryPetResultsView.types';

export const InventoryPetResultsView: FC<InventoryPetResultsViewProps> = props =>
{
    const { petItems = [] } = props;
    
    return (
        <div className="row row-cols-5 align-content-start g-0 pet-item-container">
            { (petItems && petItems.length && petItems.map((item, index) =>
                {
                    return <InventoryPetItemView key={ index } petItem={ item } />
                })) || null }
        </div>
    );
}
