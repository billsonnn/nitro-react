import { FC } from 'react';
import { InventoryTabsSelectorViewProps } from './InventoryTabsSelectorView.types';
import { InventoryTabView } from './tab/InventoryTabView';

export const InventoryTabsSelectorView: FC<InventoryTabsSelectorViewProps> = props =>
{
    return (
        <div className="p-3">
            { props.tabs &&
                <div className="btn-group w-100">
                    { props.tabs.map((tab, index) =>
                        {
                            return <InventoryTabView key={ index } tab={ tab } />
                        }) }
                </div> }
        </div>
    );
}
