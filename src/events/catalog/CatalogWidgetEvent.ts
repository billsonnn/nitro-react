import { NitroEvent } from '@nitrots/nitro-renderer';

export class CatalogWidgetEvent extends NitroEvent
{
    public static WIDGETS_INITIALIZED: string = 'CWE_CWE_WIDGETS_INITIALIZED';
    public static SELECT_PRODUCT: string = 'CWE_SELECT_PRODUCT';
    public static SET_EXTRA_PARM: string = 'CWE_CWE_SET_EXTRA_PARM';
    public static PURCHASE: string = 'CWE_PURCHASE';
    public static COLOUR_ARRAY: string = 'CWE_COLOUR_ARRAY';
    public static MULTI_COLOUR_ARRAY: string = 'CWE_MULTI_COLOUR_ARRAY';
    public static COLOUR_INDEX: string = 'CWE_COLOUR_INDEX';
    public static TEXT_INPUT: string = 'CWE_TEXT_INPUT';
    public static DROPMENU_SELECT: string = 'CWE_CWE_DROPMENU_SELECT';
    public static APPROVE_RESULT: string = 'CWE_CWE_APPROVE_RESULT';
    public static PURCHASE_OVERRIDE: string = 'CWE_PURCHASE_OVERRIDE';
    public static SELLABLE_PET_PALETTES: string = 'CWE_SELLABLE_PET_PALETTES';
    public static INIT_PURCHASE: string = 'CWE_INIT_PURCHASE';
    public static UPDATE_ROOM_PREVIEW: string = 'CWE_UPDATE_ROOM_PREVIEW';
    public static GUILD_SELECTED: string = 'CWE_GUILD_SELECTED';
    public static TOTAL_PRICE_WIDGET_INITIALIZED: string = 'CWE_TOTAL_PRICE_WIDGET_INITIALIZED';
    public static PRODUCT_OFFER_UPDATED: string = 'CWE_CWE_PRODUCT_OFFER_UPDATED';
    public static SET_PREVIEWER_STUFFDATA: string = 'CWE_CWE_SET_PREVIEWER_STUFFDATA';
    public static EXTRA_PARAM_REQUIRED_FOR_BUY: string = 'CWE_CWE_EXTRA_PARAM_REQUIRED_FOR_BUY';
    public static TOGGLE: string = 'CWE_CWE_TOGGLE';
    public static BUILDER_SUBSCRIPTION_UPDATED: string = 'CWE_CWE_BUILDER_SUBSCRIPTION_UPDATED';
    public static ROOM_CHANGED: string = 'CWE_CWE_ROOM_CHANGED';
    public static SHOW_WARNING_TEXT: string = 'CWE_CWE_SHOW_WARNING_TEXT';
}
