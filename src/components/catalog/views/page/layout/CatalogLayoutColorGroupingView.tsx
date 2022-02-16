import { FC, useState } from 'react';
import { CatalogLayoutProps } from './CatalogLayout.types';

export interface CatalogLayoutColorGroupViewProps extends CatalogLayoutProps
{

}

export const CatalogLayoutColorGroupingView : FC<CatalogLayoutColorGroupViewProps> = props =>
{
    const { page = null } = props;
    const [ colorableItems, setColorableItems ] = useState<Map<string, number[]>>(new Map<string, number[]>());

    // const offers = useMemo(() =>
    // {
    //     const offers: CatalogPageMessageOfferData[] = [];
    //     const addedColorableItems = new Map<string, boolean>();

    //     pageParser.offers.forEach(offer =>
    //     {
    //         const product = offer.products[0];
    //         if(!product) return;
            
    //         let furniData: IFurnitureData = null;

    //         if(product.productType === ProductTypeEnum.FLOOR)
    //         {
    //             furniData = GetSessionDataManager().getFloorItemData(product.furniClassId);
    //         }
    //         else if(product.productType === ProductTypeEnum.WALL)
    //         {
    //             furniData = GetSessionDataManager().getWallItemData(product.furniClassId);
    //         }

    //         if(((!(furniData)) || ((furniData.fullName.indexOf('*') === -1))))
    //         {
    //             offers.push(offer);
    //         }
    //         else
    //         {
    //             const name = furniData.fullName.split('*')[0];
    //             const colorIndex = parseInt(furniData.fullName.split('*')[1]);

    //             if(!colorableItems[name])
    //             {
    //                 colorableItems[name] = [];
    //             }

    //             let selectedColor = 0;
    //             if(furniData.colors)
    //             {
    //                 for(let color of furniData.colors)
    //                 {
    //                     if(color !== 0xFFFFFF)
    //                     {
    //                         selectedColor = color;
    //                     }
    //                 }
    //                 if(colorableItems[name].indexOf(selectedColor) === -1)
    //                 {
    //                     colorableItems[name][colorIndex] = selectedColor;
    //                 }
    //             }

    //             if(!addedColorableItems.has(name))
    //             {
    //                 offers.push(offer);
    //                 addedColorableItems.set(name, true);
    //             }
    //         }
    //     });
    //     console.log(colorableItems);
    //     return offers;
    // }, [colorableItems, pageParser.offers]);

    return null;

    // return (
    //     <NitroLayoutGrid>
    //         <NitroLayoutGridColumn size={ 7 }>
    //             <CatalogPageOffersView offers={ offers } />
    //         </NitroLayoutGridColumn>
    //         <NitroLayoutGridColumn size={ 5 }>
                
    //         </NitroLayoutGridColumn>
    //     </NitroLayoutGrid>
    // );
}
