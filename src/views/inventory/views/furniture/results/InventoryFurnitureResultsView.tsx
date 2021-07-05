import { FC } from 'react';
import { InventoryFurnitureItemView } from '../item/InventoryFurnitureItemView';
import { InventoryFurnitureResultsViewProps } from './InventoryFurnitureResultsView.types';

export const InventoryFurnitureResultsView: FC<InventoryFurnitureResultsViewProps> = props =>
{
    const { groupItems = [] } = props;

    return (
        <div className="h-100 overflow-hidden">
            <div className="row row-cols-5 align-content-start g-0 w-100 h-100 overflow-auto">
                { groupItems && (groupItems.length > 0) && groupItems.map((item, index) =>
                    {
                        return <InventoryFurnitureItemView key={ index } groupItem={ item } />
                    }) }
            </div>
        </div>
    );
}
