import { AdvancedMap, IObjectData, ItemDataStructure, StringDataType } from '@nitrots/nitro-renderer';
import { GetSessionDataManager } from '../../../api';
import { FurniCategory } from './FurniCategory';
import { FurnitureItem } from './FurnitureItem';
import { createGroupItem } from './FurnitureUtilities';
import { GroupItem } from './GroupItem';

function isExternalImage(spriteId: number): boolean
{
    const furnitureData = GetSessionDataManager().getWallItemData(spriteId);

    return (furnitureData && furnitureData.isExternalImage);
}

export function parseTradeItems(items: ItemDataStructure[], _arg_2: AdvancedMap<string, GroupItem>): void
{
    const totalItems = items.length;

    if(!totalItems) return;

    for(const item of items)
    {
        const spriteId = item.spriteId;
        const category = item.category;

        let name = (item.furniType + spriteId);

        if(!item.isGroupable || isExternalImage(spriteId))
        {
            name = ('itemid' + item.itemId);
        }

        if(item.category === FurniCategory.POSTER)
        {
            name = (item.itemId + 'poster' + item.stuffData.getLegacyString());
        }

        else if(item.category === FurniCategory.GUILD_FURNI)
        {
            name = '';
        }

        let groupItem = ((item.isGroupable && !isExternalImage(item.spriteId)) ? _arg_2.getValue(name) : null);

        if(!groupItem)
        {
            groupItem = createGroupItem(spriteId, category, item.stuffData);

            _arg_2.add(name, groupItem);
        }

        groupItem.push(new FurnitureItem(item));
    }
}

export function _Str_16998(spriteId: number, stuffData: IObjectData): string
{
    let type = spriteId.toString();
    const _local_4 = (stuffData as StringDataType);

    if(!(stuffData instanceof StringDataType)) return type;

    let _local_5 = 1;

    while(_local_5 < 5)
    {
        type = (type + (',' + _local_4.getValue(_local_5)));

        _local_5++;
    }

    return type;
}
