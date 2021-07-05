import { FC } from 'react';
import { LocalizeText } from '../../../../utils/LocalizeText';
import { useInventoryContext } from '../../context/InventoryContext';
import { InventoryTradeViewProps } from './InventoryTradeView.types';
import { InventoryTradeItemView } from './item/InventoryTradeItemView';

const MAX_ITEMS_COUNT: number = 9;

export const InventoryTradeView: FC<InventoryTradeViewProps> = props =>
{
    const { isInFurnitureView = false } = props;
    const { furnitureState = null } = useInventoryContext();
    const { tradeData = null } = furnitureState;

    return (
        <div className="row h-100 mt-2">
            <div className="d-flex flex-column col-6">
                <div className="badge bg-primary w-100 p-1 mb-1 me-1">{ LocalizeText('inventory.trading.you') }</div>
                <div className="row row-cols-3 align-content-start g-0 w-100 h-100">
                    { Array.from(Array(MAX_ITEMS_COUNT), (e, i) =>
                    {
                        return <InventoryTradeItemView key={ i } groupItem={ (tradeData.ownUser.items.getWithIndex(i) || null) } />;
                    }) }
                </div>
            </div>
            <div className="d-flex flex-column col-6">
                <div className="badge bg-primary w-100 p-1 mb-1 me-1">{ tradeData.otherUser.userName }</div>
                <div className="row row-cols-3 align-content-start g-0 w-100 h-100">
                    { Array.from(Array(MAX_ITEMS_COUNT), (e, i) =>
                    {
                        return <InventoryTradeItemView key={ i } groupItem={ (tradeData.otherUser.items.getWithIndex(i) || null) } />;
                    }) }
                </div>
            </div>
        </div>
    );
}
