import { FC } from 'react';
import { InventoryFurnitureItemView } from '../item/InventoryFurnitureItemView';
import { InventoryFurnitureResultsViewProps } from './InventoryFurnitureResultsView.types';

export const InventoryFurnitureResultsView: FC<InventoryFurnitureResultsViewProps> = props =>
{
    const { groupItems = [] } = props;

    return (
        <div className="row row-cols-5 align-content-start g-0 fruni-item-container">
            { (groupItems && groupItems.length && groupItems.map((item, index) =>
                {
                    return <InventoryFurnitureItemView key={ index } groupItem={ item } />
                })) || null }
        </div>
    );
}
