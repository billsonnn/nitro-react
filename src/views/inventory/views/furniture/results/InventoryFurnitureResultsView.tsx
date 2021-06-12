import { FC } from 'react';
import { ScrollableAreaView } from '../../../../../layout/scrollable-area/ScrollableAreaView';
import { InventoryFurnitureItemView } from '../item/InventoryFurnitureItemView';
import { InventoryFurnitureResultsViewProps } from './InventoryFurnitureResultsView.types';

export const InventoryFurnitureResultsView: FC<InventoryFurnitureResultsViewProps> = props =>
{
    const { groupItems = [] } = props;

    return (
        <div className="d-flex flex-grow-1">
            <ScrollableAreaView className="row row-cols-5 align-content-start g-0 w-100">
                { groupItems && (groupItems.length > 0) && groupItems.map((item, index) =>
                    {
                        return <InventoryFurnitureItemView key={ index } groupItem={ item } />
                    }) }
            </ScrollableAreaView>
        </div>
    );
}
