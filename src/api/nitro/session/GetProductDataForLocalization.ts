import { GetSessionDataManager, IProductData } from '@nitrots/nitro-renderer';

export function GetProductDataForLocalization(localizationId: string): IProductData
{
    if(!localizationId) return null;

    return GetSessionDataManager().getProductData(localizationId);
}
