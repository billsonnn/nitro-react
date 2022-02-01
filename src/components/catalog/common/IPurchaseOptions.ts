import { IObjectData } from '@nitrots/nitro-renderer';

export interface IPurchaseOptions
{
    quantity?: number;
    extraData?: string;
    extraParamRequired?: boolean;
    purchaseCallback?: Function;
    previewStuffData?: IObjectData;
}
