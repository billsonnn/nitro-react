import { Vector3d } from 'nitro-renderer';
import { FC, useEffect } from 'react';
import { GetAvatarRenderManager, GetFurnitureDataForProductOffer, GetSessionDataManager } from '../../../../api';
import { FurniCategory } from '../../common/FurniCategory';
import { ProductTypeEnum } from '../../common/ProductTypeEnum';
import { useCatalogContext } from '../../context/CatalogContext';
import { CatalogPageViewProps } from './CatalogPageView.types';
import { GetCatalogLayout } from './layout/GetCatalogLayout';
import { CatalogLayoutSearchResultView } from './search-result/CatalogLayoutSearchResultView';

export const CatalogPageView: FC<CatalogPageViewProps> = props =>
{
    const { roomPreviewer = null } = props;
    const { catalogState = null } = useCatalogContext();
    const { pageParser = null, activeOffer = null, searchResult = null } = catalogState;

    useEffect(() =>
    {
        if(!roomPreviewer) return;

        roomPreviewer && roomPreviewer.reset(false);

        if(activeOffer && activeOffer.products.length)
        {
            const product = activeOffer.products[0];

            if(!product) return;
            
            const furniData = GetFurnitureDataForProductOffer(product);

            if(!furniData && (product.productType !== ProductTypeEnum.ROBOT)) return;

            switch(product.productType)
            {
                case ProductTypeEnum.ROBOT: {
                    roomPreviewer.updateObjectRoom('default', 'default', 'default');
                    const figure = GetAvatarRenderManager().getFigureStringWithFigureIds(product.extraParam, 'm', []);

                    roomPreviewer.addAvatarIntoRoom(figure, 0);

                    return;
                }
                case ProductTypeEnum.FLOOR: {
                    roomPreviewer.updateObjectRoom('default', 'default', 'default');

                    if(furniData.specialType === FurniCategory.FIGURE_PURCHASABLE_SET)
                    {
                        const setIds: number[]  = [];
                        const sets              = furniData.customParams.split(',');

                        for(const set of sets)
                        {
                            const setId = parseInt(set);

                            if(GetAvatarRenderManager().isValidFigureSetForGender(setId, GetSessionDataManager().gender)) setIds.push(setId);
                        }

                        const figure = GetAvatarRenderManager().getFigureStringWithFigureIds(GetSessionDataManager().figure, GetSessionDataManager().gender, setIds);

                        roomPreviewer.addAvatarIntoRoom(figure, 0);
                    }
                    else
                    {
                        roomPreviewer.addFurnitureIntoRoom(product.furniClassId, new Vector3d(90));
                    }
                    return;
                }
                case ProductTypeEnum.WALL:

                    switch(furniData.className)
                    {
                        case 'floor':
                            roomPreviewer.reset(false);
                            roomPreviewer.updateObjectRoom(product.extraParam);
                            break;
                        case 'wallpaper':
                            roomPreviewer.reset(false);
                            roomPreviewer.updateObjectRoom(null, product.extraParam);
                            break;
                        case 'landscape':
                            roomPreviewer.reset(false);
                            roomPreviewer.updateObjectRoom(null, null, product.extraParam);
                            break;
                        default:
                            roomPreviewer.updateObjectRoom('default', 'default', 'default');
                            roomPreviewer.addWallItemIntoRoom(product.furniClassId, new Vector3d(90), product.extraParam);
                            return;
                    }

                    // const windowData = Nitro.instance.sessionDataManager.getWallItemDataByName('ads_twi_windw');

                    // if(windowData)
                    // {
                    //     this._roomPreviewer.addWallItemIntoRoom(windowData.id, new Vector3d(90), windowData.customParams)
                    // }
                    return;
            }
        }
    }, [ roomPreviewer, activeOffer ]);

    if(searchResult && searchResult.furniture)
    {
        return <CatalogLayoutSearchResultView roomPreviewer={ roomPreviewer } furnitureDatas={ searchResult.furniture } />;
    }

    return ((pageParser && GetCatalogLayout(pageParser, roomPreviewer)) || null);
}
