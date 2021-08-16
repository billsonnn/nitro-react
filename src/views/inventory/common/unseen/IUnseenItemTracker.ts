export interface IUnseenItemTracker
{
    dispose(): void;
    resetCategory(category: number): boolean;
    resetItems(category: number, itemIds: number[]): boolean;
    resetCategoryIfEmpty(category: number): boolean;
    isUnseen(category: number, itemId: number): boolean;
    removeUnseen(category: number, itemId: number): boolean;
    getIds(category: number): number[];
    getCount(category: number): number;
    getFullCount(): number;
    addItems(category: number, itemIds: number[]): void;
}
