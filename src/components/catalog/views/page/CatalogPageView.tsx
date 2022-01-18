import { IObjectData, RoomPreviewer, Vector3d } from '@nitrots/nitro-renderer';
import { FC, useCallback, useEffect } from 'react';
import { GetAvatarRenderManager, GetSessionDataManager } from '../../../../api';
import { CatalogPageReadyEvent, SetRoomPreviewerStuffDataEvent } from '../../../../events';
import { dispatchUiEvent, useUiEvent } from '../../../../hooks';
import { FurniCategory } from '../../common/FurniCategory';
import { ICatalogPage } from '../../common/ICatalogPage';
import { IPurchasableOffer } from '../../common/IPurchasableOffer';
import { ProductTypeEnum } from '../../common/ProductTypeEnum';
import { useCatalogContext } from '../../context/CatalogContext';
import { GetCatalogLayout } from './layout/GetCatalogLayout';

export interface CatalogPageViewProps
{
    page: ICatalogPage;
    roomPreviewer: RoomPreviewer;
}

export const CatalogPageView: FC<CatalogPageViewProps> = props =>
{
    const { page = null, roomPreviewer = null } = props;
    const { currentOffer = null } = useCatalogContext();

    const updatePreviewerForOffer = useCallback((offer: IPurchasableOffer, stuffData: IObjectData = null) =>
    {
        if(!offer || !roomPreviewer) return;

        const product = offer.product;

        if(!product && !product.furnitureData && (product.productType !== ProductTypeEnum.ROBOT)) return;

        switch(product.productType.toLowerCase())
        {
            case ProductTypeEnum.ROBOT: {
                roomPreviewer.updateObjectRoom('default', 'default', 'default');
                const figure = GetAvatarRenderManager().getFigureStringWithFigureIds(product.extraParam, 'm', []);

                roomPreviewer.addAvatarIntoRoom(figure, 0);

                return;
            }
            case ProductTypeEnum.FLOOR: {
                roomPreviewer.updateObjectRoom('default', 'default', 'default');

                if(product.furnitureData.specialType === FurniCategory.FIGURE_PURCHASABLE_SET)
                {
                    const setIds: number[] = [];
                    const sets = product.furnitureData.customParams.split(',');

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
                    console.log('??')
                    roomPreviewer.addFurnitureIntoRoom(product.productClassId, new Vector3d(90), stuffData);
                }
                return;
            }
            case ProductTypeEnum.WALL: {
                switch(product.furnitureData.className)
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
                        roomPreviewer.addWallItemIntoRoom(product.productClassId, new Vector3d(90), product.extraParam);
                        return;
                }

                const windowData = GetSessionDataManager().getWallItemDataByName('noob_window_double');

                if(windowData) roomPreviewer.addWallItemIntoRoom(windowData.id, new Vector3d(90, 0, 0), windowData.customParams);

                return;
            }
        }
    }, [ roomPreviewer ]);

    const onSetRoomPreviewerStuffDataEvent = useCallback((event: SetRoomPreviewerStuffDataEvent) =>
    {
        if(roomPreviewer) roomPreviewer.reset(false);

        updatePreviewerForOffer(event.offer, event.stuffData);
    }, [ roomPreviewer, updatePreviewerForOffer ]);

    useUiEvent(SetRoomPreviewerStuffDataEvent.UPDATE_STUFF_DATA, onSetRoomPreviewerStuffDataEvent);

    useEffect(() =>
    {
        if(!currentOffer) return;

        updatePreviewerForOffer(currentOffer);
    }, [ currentOffer, updatePreviewerForOffer ]);

    useEffect(() =>
    {
        dispatchUiEvent(new CatalogPageReadyEvent());
    }, [ page ]);

    if(!page) return null;

    return GetCatalogLayout(page, roomPreviewer);
}
