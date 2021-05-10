import { Vector3d } from 'nitro-renderer';
import { FC, useEffect } from 'react';
import { GetAvatarRenderManager, GetFurnitureDataForProductOffer, GetSessionDataManager } from '../../../../../api';
import { LimitedEditionCompletePlateView } from '../../../../limited-edition/complete-plate/LimitedEditionCompletePlateView';
import { RoomPreviewerView } from '../../../../room-previewer/RoomPreviewerView';
import { useCatalogContext } from '../../../context/CatalogContext';
import { FurniCategory } from '../../../enums/FurniCategory';
import { ProductTypeEnum } from '../../../enums/ProductTypeEnum';
import { GetOfferName } from '../../../utils/CatalogUtilities';
import { CatalogPurchaseView } from '../purchase/CatalogPurchaseView';
import { CatalogLayoutSearchResultViewProps } from './CatalogLayoutSearchResultView.types';
import { CatalogSearchResultOffersView } from './offers/CatalogSearchResultOffersView';

export const CatalogLayoutSearchResultView: FC<CatalogLayoutSearchResultViewProps> = props =>
{
    const { roomPreviewer = null, furnitureDatas = null } = props;
    const { catalogState } = useCatalogContext();
    const { activeOffer = null } = catalogState;

    useEffect(() =>
    {
        if(!roomPreviewer) return;

        if(!activeOffer)
        {
            roomPreviewer && roomPreviewer.reset(false);

            return;
        }

        const product = activeOffer.products[0];

        if(!product) return;
        
        const furniData = GetFurnitureDataForProductOffer(product);

        if(!furniData && product.productType !== ProductTypeEnum.ROBOT) return;

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
    }, [ roomPreviewer, activeOffer ]);

    const product = ((activeOffer && activeOffer.products[0]) || null);

    return (
        <div className="row h-100">
            <div className="col-7">
                <CatalogSearchResultOffersView offers={ furnitureDatas } />
            </div>
            { product &&
                <div className="position-relative d-flex flex-column col">
                    <RoomPreviewerView roomPreviewer={ roomPreviewer } height={ 140 } />
                    { product.uniqueLimitedItem &&
                        <LimitedEditionCompletePlateView uniqueLimitedItemsLeft={ product.uniqueLimitedItemsLeft } uniqueLimitedSeriesSize={ product.uniqueLimitedSeriesSize } /> }
                    <div className="fs-6 text-black mt-1 overflow-hidden">{ GetOfferName(activeOffer) }</div>
                    <CatalogPurchaseView offer={ activeOffer } pageId={ -1 } />
                </div> }
        </div>
    );
}
