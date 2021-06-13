import { FurnitureWidgetProps } from '../FurnitureWidget.types';

export interface FurnitureMannequinViewProps extends FurnitureWidgetProps
{}

export class FurnitureMannequinViewMode
{
    public static readonly EDIT: string = 'edit';
    public static readonly SAVE: string = 'save';
    public static readonly CLUB: string = 'club';
    public static readonly DEFAULT: string = 'default';
    public static readonly INCOMPATIBLE_GENDER: string = 'incompatible_gender';
}
