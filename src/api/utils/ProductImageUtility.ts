import { CatalogPageMessageProductData } from '@nitrots/nitro-renderer';
import { FurniCategory } from '../inventory';
import { GetRoomEngine } from '../nitro';

export class ProductImageUtility
{
    public static getProductImageUrl(productType: string, furniClassId: number, extraParam: string): string
    {
        let imageUrl: string = null;

        switch(productType)
        {
            case CatalogPageMessageProductData.S:
                imageUrl = GetRoomEngine().getFurnitureFloorIconUrl(furniClassId);
                break;
            case CatalogPageMessageProductData.I:
                const productCategory = this.getProductCategory(CatalogPageMessageProductData.I, furniClassId);

                if(productCategory === 1)
                {
                    imageUrl = GetRoomEngine().getFurnitureWallIconUrl(furniClassId, extraParam);
                }
                else
                {
                    switch(productCategory)
                    {
                        case FurniCategory.WALL_PAPER:
                            break;
                        case FurniCategory.LANDSCAPE:
                            break;
                        case FurniCategory.FLOOR:
                            break;
                    }
                }
                break;
            case CatalogPageMessageProductData.E:
            // fx_icon_furniClassId_png
                break;
        }

        return imageUrl;
    }

    public static getProductCategory(productType: string, furniClassId: number): number
    {
        if(productType === CatalogPageMessageProductData.S) return 1;

        if(productType === CatalogPageMessageProductData.I)
        {
            if(furniClassId === 3001) return FurniCategory.WALL_PAPER;

            if(furniClassId === 3002) return FurniCategory.FLOOR;

            if(furniClassId === 4057) return FurniCategory.LANDSCAPE;
        }

        return 1;
    }
}
