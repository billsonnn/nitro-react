import { FC } from 'react';
import { NitroCardGridView } from '../../../../../layout/card/grid/NitroCardGridView';
import { InventoryBotItemView } from '../item/InventoryBotItemView';
import { InventoryBotResultsViewProps } from './InventoryBotResultsView.types';

export const InventoryBotResultsView: FC<InventoryBotResultsViewProps> = props =>
{
    const { botItems = [] } = props;
    
    return (
        <NitroCardGridView>
            { botItems && (botItems.length > 0) && botItems.map(item =>
                {
                    return <InventoryBotItemView key={ item.id } botItem={ item } />
                }) }
        </NitroCardGridView>
    );
}
