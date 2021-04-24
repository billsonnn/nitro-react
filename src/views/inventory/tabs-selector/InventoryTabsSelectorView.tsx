import { FC } from 'react';
import { InventoryTabsSelectorViewProps } from './InventoryTabsSelectorView.types';
import { InventoryTabView } from './tab/InventoryTabView';

export const InventoryTabsSelectorView: FC<InventoryTabsSelectorViewProps> = props =>
{
    const { tabs = null } = props;

    return (
        <div className="p-3">
            { tabs && tabs.length &&
                <div className="btn-group w-100">
                    { props.tabs.map((tab, index) =>
                        {
                            return <InventoryTabView key={ index } tab={ tab } />
                        }) }
                </div> }
        </div>
    );
}
