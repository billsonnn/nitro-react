import { FC } from 'react';
import { Grid } from '../../../../../common/Grid';
import { InventoryFurnitureItemView } from '../item/InventoryFurnitureItemView';
import { InventoryFurnitureResultsViewProps } from './InventoryFurnitureResultsView.types';

export const InventoryFurnitureResultsView: FC<InventoryFurnitureResultsViewProps> = props =>
{
    const { groupItems = [] } = props;

    return (
        <Grid grow columnCount={ 5 } overflow="auto">
            { groupItems && (groupItems.length > 0) && groupItems.map((item, index) =>
                {
                    return <InventoryFurnitureItemView key={ index } groupItem={ item } />
                }) }
        </Grid>
    );
}
