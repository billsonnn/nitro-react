import { ICalendarItem } from './ICalendarItem';

export class CalendarItem implements ICalendarItem
{
    private _productName: string;
    private _customImage: string;
    private _furnitureClassName: string;

    constructor(productName: string, customImage: string, furnitureClassName: string)
    {
        this._productName = productName;
        this._customImage = customImage;
        this._furnitureClassName = furnitureClassName;
    }

    public get productName(): string
    {
        return this._productName;
    }

    public get customImage(): string
    {
        return this._customImage;
    }

    public get furnitureClassName(): string
    {
        return this._furnitureClassName;
    }
}
