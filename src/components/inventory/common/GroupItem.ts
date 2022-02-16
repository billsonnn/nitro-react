import { IObjectData, IRoomEngine } from '@nitrots/nitro-renderer';
import { LocalizeText } from '../../../api';
import { FurniCategory } from './FurniCategory';
import { FurnitureItem } from './FurnitureItem';
import { IFurnitureItem } from './IFurnitureItem';

export class GroupItem
{
    private _type: number;
    private _category: number;
    private _roomEngine: IRoomEngine;
    private _stuffData: IObjectData;
    private _extra: number;
    private _isWallItem: boolean;
    private _iconUrl: string;
    private _name: string;
    private _description: string;
    private _locked: boolean;
    private _selected: boolean;
    private _hasUnseenItems: boolean;
    private _items: FurnitureItem[];

    constructor(type: number = -1, category: number = -1, roomEngine: IRoomEngine = null, stuffData: IObjectData = null, extra: number = -1)
    {
        this._type = type;
        this._category = category;
        this._roomEngine = roomEngine;
        this._stuffData = stuffData;
        this._extra = extra;
        this._isWallItem = false;
        this._iconUrl = null;
        this._name = null;
        this._description = null;
        this._locked = false;
        this._selected = false;
        this._hasUnseenItems = false;
        this._items = [];
    }

    public clone(): GroupItem
    {
        const groupItem = new GroupItem();

        groupItem._type = this._type;
        groupItem._category = this._category;
        groupItem._roomEngine = this._roomEngine;
        groupItem._stuffData = this._stuffData;
        groupItem._extra = this._extra;
        groupItem._isWallItem = this._isWallItem;
        groupItem._iconUrl = this._iconUrl;
        groupItem._name = this._name;
        groupItem._description = this._description;
        groupItem._locked = this._locked;
        groupItem._selected = this._selected;
        groupItem._hasUnseenItems = this._hasUnseenItems;
        groupItem._items = this._items;

        return groupItem;
    }

    public prepareGroup(): void
    {
        this.setIcon();
        this.setName();
        this.setDescription();
    }

    public dispose(): void
    {

    }

    public getItemByIndex(index: number): FurnitureItem
    {
        return this._items[index];
    }

    public getItemById(id: number): FurnitureItem
    {
        for(const item of this._items)
        {
            if(item.id !== id) continue;

            return item;
        }

        return null;
    }

    public getTradeItems(count: number): IFurnitureItem[]
    {
        const items: IFurnitureItem[] = [];

        const furnitureItem = this.getLastItem();

        if(!furnitureItem) return items;

        let found   = 0;
        let i       = 0;

        while(i < this._items.length)
        {
            if(found >= count) break;

            const item = this.getItemByIndex(i);

            if(!item.locked && item.isTradable && (item.type === furnitureItem.type))
            {
                items.push(item);

                found++;
            }

            i++;
        }

        return items;
    }

    public push(item: FurnitureItem): void
    {
        const items = [ ...this._items ];

        let index = 0;

        while(index < items.length)
        {
            let existingItem = items[index];

            if(existingItem.id === item.id)
            {
                existingItem = existingItem.clone();

                existingItem.locked = false;

                items.splice(index, 1);

                items.push(existingItem);

                this._items = items;

                return;
            }

            index++;
        }

        items.push(item);

        this._items = items;

        if(this._items.length === 1) this.prepareGroup();
    }

    public pop(): FurnitureItem
    {
        const items = [ ...this._items ];

        let item: FurnitureItem = null;

        if(items.length > 0)
        {
            const index = (items.length - 1);

            item = items[index];

            items.splice(index, 1);
        }

        this._items = items;

        return item;
    }

    public remove(k: number): FurnitureItem
    {
        const items = [ ...this._items ];

        let index = 0;

        while(index < items.length)
        {
            let existingItem = items[index];

            if(existingItem.id === k)
            {
                items.splice(index, 1);

                this._items = items;

                return existingItem;
            }

            index++;
        }

        return null;
    }

    public getTotalCount(): number
    {
        if(this._category === FurniCategory.POST_IT)
        {
            let count   = 0;
            let index   = 0;

            while(index < this._items.length)
            {
                const item = this.getItemByIndex(index);

                count = (count + parseInt(item.stuffData.getLegacyString()));

                index++;
            }

            return count;
        }

        return this._items.length;
    }

    public getUnlockedCount(): number
    {
        if(this.category === FurniCategory.POST_IT) return this.getTotalCount();

        let count = 0;
        let index = 0;

        while(index < this._items.length)
        {
            const item = this.getItemByIndex(index);

            if(!item.locked) count++;

            index++;
        }

        return count;
    }

    public getLastItem(): FurnitureItem
    {
        if(!this._items.length) return null;

        const item = this.getItemByIndex((this._items.length - 1));

        return item;
    }

    public unlockAllItems(): void
    {
        const items = [ ...this._items ];

        let index = 0;

        while(index < items.length)
        {
            const item = items[index];

            if(item.locked)
            {
                const newItem = item.clone();

                newItem.locked = false;

                items[index] = newItem;
            }

            index++;
        }

        this._items = items;
    }

    public lockItemIds(itemIds: number[]): boolean
    {
        const items = [ ...this._items ];

        let index = 0;
        let updated = false;

        while(index < items.length)
        {
            const item      = items[index];
            const locked    = (itemIds.indexOf(item.ref) >= 0);

            if(item.locked !== locked)
            {
                updated = true;

                const newItem = item.clone();

                newItem.locked = locked;

                items[index] = newItem;
            }

            index++;
        }

        this._items = items;

        return updated;
    }

    private setName(): void
    {
        const k = this.getLastItem();

        if(!k)
        {
            this._name = '';

            return;
        }

        let key = '';

        switch(this._category)
        {
            case FurniCategory.POSTER:
                key = (('poster_' + k.stuffData.getLegacyString()) + '_name');
                break;
            case FurniCategory.TRAX_SONG:
                this._name = 'SONG_NAME';
                return;
            default:
                if(this.isWallItem)
                {
                    key = ('wallItem.name.' + k.type);
                }
                else
                {
                    key = ('roomItem.name.' + k.type);
                }
        }

        this._name = LocalizeText(key);
    }

    private setDescription(): void
    {
        this._description = '';
    }

    private setIcon(): void
    {
        if(this._iconUrl) return;

        let url = null;

        if(this.isWallItem)
        {
            url = this._roomEngine.getFurnitureWallIconUrl(this._type, this._stuffData.getLegacyString());
        }
        else
        {
            url = this._roomEngine.getFurnitureFloorIconUrl(this._type);
        }

        if(!url) return;

        this._iconUrl = url;
    }

    public get type(): number
    {
        return this._type;
    }

    public get category(): number
    {
        return this._category;
    }

    public get stuffData(): IObjectData
    {
        return this._stuffData;
    }

    public get extra(): number
    {
        return this._extra;
    }

    public get iconUrl(): string
    {
        return this._iconUrl;
    }

    public get name(): string
    {
        return this._name;
    }

    public get description(): string
    {
        return this._description;
    }

    public get hasUnseenItems(): boolean
    {
        return this._hasUnseenItems;
    }

    public set hasUnseenItems(flag: boolean)
    {
        this._hasUnseenItems = flag;
    }

    public get locked(): boolean
    {
        return this._locked;
    }

    public set locked(flag: boolean)
    {
        this._locked = flag;
    }

    public get selected(): boolean
    {
        return this._selected;
    }

    public set selected(flag: boolean)
    {
        this._selected = flag;
    }

    public get isWallItem(): boolean
    {
        const item = this.getItemByIndex(0);

        return (item ? item.isWallItem : false);
    }

    public get isGroupable(): boolean
    {
        const item = this.getItemByIndex(0);

        return (item ? item.isGroupable : false);
    }

    public get isSellable(): boolean
    {
        const item = this.getItemByIndex(0);

        return (item ? item.sellable : false);
    }

    public get items(): FurnitureItem[]
    {
        return this._items;
    }

    public set items(items: FurnitureItem[])
    {
        this._items = items;
    }
}
