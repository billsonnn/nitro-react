import { UnseenResetCategoryComposer, UnseenResetItemsComposer } from '@nitrots/nitro-renderer';
import { UnseenItemTrackerUpdateEvent } from '../../../../events';
import { dispatchUiEvent, SendMessageHook } from '../../../../hooks';
import { IUnseenItemTracker } from './IUnseenItemTracker';

export class UnseenItemTracker implements IUnseenItemTracker
{
    private _unseenItems: Map<number, number[]> = new Map();

    public dispose(): void
    {
        this._unseenItems.clear();
    }

    public resetCategory(category: number): boolean
    {
        if(!this.getCount(category)) return false;

        this._unseenItems.delete(category);

        this.dispatchUpdateEvent();

        this.sendResetCategoryMessage(category);

        return true;
    }

    public resetItems(category: number, itemIds: number[]): boolean
    {
        if(!this.getCount(category)) return false;

        const existing = this._unseenItems.get(category);

        for(const itemId of itemIds)
        {
            existing.splice(existing.indexOf(itemId), 1);
        }

        this.dispatchUpdateEvent();

        this.sendResetItemsMessage(category, itemIds);

        return true;
    }

    public resetCategoryIfEmpty(category: number): boolean
    {
        if(this.getCount(category)) return false;

        this._unseenItems.delete(category);

        this.dispatchUpdateEvent();

        this.sendResetCategoryMessage(category);

        return true;
    }

    public isUnseen(category: number, itemId: number): boolean
    {
        if(!this._unseenItems.get(category)) return false;

        const items = this._unseenItems.get(category);

        return (items.indexOf(itemId) >= 0);
    }

    public removeUnseen(category: number, itemId: number): boolean
    {
        if(!this._unseenItems.get(category)) return false;

        const items = this._unseenItems.get(category);
        const index = items.indexOf(itemId);

        if(index === -1) return false;

        items.splice(index, 1);

        this.dispatchUpdateEvent();

        return true;
    }

    public getIds(category: number): number[]
    {
        if(!this._unseenItems) return [];

        return this._unseenItems.get(category);
    }

    public getCount(category: number): number
    {
        if(!this._unseenItems.get(category)) return 0;

        return this._unseenItems.get(category).length;
    }

    public getFullCount(): number
    {
        let count = 0;

        for(const key of this._unseenItems.keys())
        {
            count += this.getCount(key);
        }

        return count;
    }

    public addItems(category: number, itemIds: number[]): void
    {
        if(!itemIds) return;

        let unseenItems = this._unseenItems.get(category);

        if(!unseenItems)
        {
            unseenItems = [];

            this._unseenItems.set(category, unseenItems);
        }

        for(const itemId of itemIds)
        {
            if(unseenItems.indexOf(itemId) === -1) unseenItems.push(itemId);
        }

        this.dispatchUpdateEvent();
    }

    private dispatchUpdateEvent(): void
    {
        dispatchUiEvent(new UnseenItemTrackerUpdateEvent(this.getFullCount()));
    }

    private sendResetCategoryMessage(category: number): void
    {
        SendMessageHook(new UnseenResetCategoryComposer(category));
    }

    private sendResetItemsMessage(category: number, itemIds: number[]): void
    {
        SendMessageHook(new UnseenResetItemsComposer(category, ...itemIds));
    }
}
