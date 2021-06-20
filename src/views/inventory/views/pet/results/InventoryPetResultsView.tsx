import { FC } from 'react';
import { InventoryPetItemView } from '../item/InventoryPetItemView';
import { InventoryPetResultsViewProps } from './InventoryPetResultsView.types';

export const InventoryPetResultsView: FC<InventoryPetResultsViewProps> = props =>
{
    const { petItems = [] } = props;
    
    return (
        <div className="h-100 overflow-hidden">
            <div className="row row-cols-5 align-content-start g-0 w-100 h-100 overflow-auto">
            { petItems && (petItems.length > 0) && petItems.map((item, index) =>
                    {
                        return <InventoryPetItemView key={ index } petItem={ item } />
                    }) }
            </div>
        </div>
    );
}
