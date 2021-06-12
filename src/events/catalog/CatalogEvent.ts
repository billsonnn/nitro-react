import { NitroEvent } from 'nitro-renderer';

export class CatalogEvent extends NitroEvent
{
    public static SHOW_CATALOG: string = 'CE_SHOW_CATALOG';
    public static HIDE_CATALOG: string = 'CE_HIDE_CATALOG';
    public static TOGGLE_CATALOG: string = 'CE_TOGGLE_CATALOG';
    public static PURCHASE_SUCCESS: string = 'CE_PURCHASE_SUCCESS';
    public static PURCHASE_FAILED: string = 'CE_PURCHASE_FAILED';
    public static SOLD_OUT: string = 'CE_SOLD_OUT';
    public static APPROVE_NAME_RESULT: string = 'CE_APPROVE_NAME_RESULT';
    public static PURCHASE_APPROVED: string = 'CE_PURCHASE_APPROVED';
    public static CATALOG_RESET: string = 'CE_RESET';
}
