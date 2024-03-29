import { AdvancedMap, GetSessionDataManager, IObjectData, ItemDataStructure, StringDataType } from '@nitrots/nitro-renderer';
import { FurniCategory } from './FurniCategory';
import { FurnitureItem } from './FurnitureItem';
import { createGroupItem } from './FurnitureUtilities';
import { GroupItem } from './GroupItem';

const isExternalImage = (spriteId: number) => GetSessionDataManager().getWallItemData(spriteId)?.isExternalImage || false;

export const parseTradeItems = (items: ItemDataStructure[]) =>
{
    const existingItems = new AdvancedMap<string, GroupItem>();
    const totalItems = items.length;

    if(totalItems)
    {
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
    
            let groupItem = ((item.isGroupable && !isExternalImage(item.spriteId)) ? existingItems.getValue(name) : null);
    
            if(!groupItem)
            {
                groupItem = createGroupItem(spriteId, category, item.stuffData);
    
                existingItems.add(name, groupItem);
            }
    
            groupItem.push(new FurnitureItem(item));
        }
    }

    return existingItems;
}

export const getGuildFurniType = (spriteId: number, stuffData: IObjectData) =>
{
    let type = spriteId.toString();

    if(!(stuffData instanceof StringDataType)) return type;

    let i = 1;

    while(i < 5)
    {
        type = (type + (',' + stuffData.getValue(i)));

        i++;
    }

    return type;
}
