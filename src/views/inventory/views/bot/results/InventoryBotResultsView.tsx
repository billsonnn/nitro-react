import { FC } from 'react';
import { InventoryBotItemView } from '../item/InventoryBotItemView';
import { InventoryBotResultsViewProps } from './InventoryBotResultsView.types';

export const InventoryBotResultsView: FC<InventoryBotResultsViewProps> = props =>
{
    const { botItems = [] } = props;
    
    return (
        <div className="row row-cols-5 align-content-start g-0 bot-item-container">
            { botItems && (botItems.length > 0) && botItems.map((item, index) =>
                {
                    return <InventoryBotItemView key={ index } botItem={ item } />
                }) }
        </div>
    );
}
