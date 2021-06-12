import { FC } from 'react';
import { ScrollableAreaView } from '../../../../../layout/scrollable-area/ScrollableAreaView';
import { InventoryPetItemView } from '../item/InventoryPetItemView';
import { InventoryPetResultsViewProps } from './InventoryPetResultsView.types';

export const InventoryPetResultsView: FC<InventoryPetResultsViewProps> = props =>
{
    const { petItems = [] } = props;
    
    return (
        <div className="d-flex flex-grow-1">
            <ScrollableAreaView className="row row-cols-5 align-content-start g-0 w-100">
                { petItems && (petItems.length > 0) && petItems.map((item, index) =>
                    {
                        return <InventoryPetItemView key={ index } petItem={ item } />
                    }) }
            </ScrollableAreaView>
        </div>
    );
}
