import { FC } from 'react';
import { NitroCardGridView } from '../../../../../layout/card/grid/NitroCardGridView';
import { InventoryFurnitureItemView } from '../item/InventoryFurnitureItemView';
import { InventoryFurnitureResultsViewProps } from './InventoryFurnitureResultsView.types';

export const InventoryFurnitureResultsView: FC<InventoryFurnitureResultsViewProps> = props =>
{
    const { groupItems = [], columns = 5 } = props;

    return (
        <NitroCardGridView>
            { groupItems && (groupItems.length > 0) && groupItems.map((item, index) =>
                {
                    return <InventoryFurnitureItemView key={ index } groupItem={ item } />
                }) }
        </NitroCardGridView>
    );
}
