import { FC } from 'react';
import { InventoryBotItemView } from '../item/InventoryBotItemView';
import { InventoryBotResultsViewProps } from './InventoryBotResultsView.types';

export const InventoryBotResultsView: FC<InventoryBotResultsViewProps> = props =>
{
    const { botItems = [] } = props;
    
    return (
        <div className="h-100 overflow-hidden">
            <div className="row row-cols-5 align-content-start g-0 w-100 h-100 overflow-auto">
            { botItems && (botItems.length > 0) && botItems.map((item, index) =>
                    {
                        return <InventoryBotItemView key={ index } botItem={ item } />
                    }) }
            </div>
        </div>
    );
}
