import { FC } from 'react';
import { ScrollableAreaView } from '../../../../../layout/scrollable-area/ScrollableAreaView';
import { InventoryBotItemView } from '../item/InventoryBotItemView';
import { InventoryBotResultsViewProps } from './InventoryBotResultsView.types';

export const InventoryBotResultsView: FC<InventoryBotResultsViewProps> = props =>
{
    const { botItems = [] } = props;
    
    return (
        <div className="d-flex flex-grow-1">
            <ScrollableAreaView className="row row-cols-5 align-content-start g-0 w-100">
                { botItems && (botItems.length > 0) && botItems.map((item, index) =>
                    {
                        return <InventoryBotItemView key={ index } botItem={ item } />
                    }) }
            </ScrollableAreaView>
        </div>
    );
}
