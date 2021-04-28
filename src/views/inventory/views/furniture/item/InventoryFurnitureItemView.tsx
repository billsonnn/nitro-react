import { FC } from 'react';
import { InventoryFurnitureItemViewProps } from './InventoryFurnitureItemView.types';

export const InventoryFurnitureItemView: FC<InventoryFurnitureItemViewProps> = props =>
{
    const { groupItem = null, isActive = false, setGroupItem = null } = props;

    const imageUrl = `url(${ groupItem.iconUrl })`;

    return (
        <div className="col pe-1 pb-1">
            <div className={ 'position-relative border border-2 rounded inventory-furniture-item cursor-pointer ' + (isActive && 'active') } style={ { backgroundImage: imageUrl }} onClick={ event => setGroupItem(groupItem) }>
                <span className="position-absolute badge border bg-secondary p-1">{ groupItem.getUnlockedCount() }</span>
            </div>
        </div>
    );
}
