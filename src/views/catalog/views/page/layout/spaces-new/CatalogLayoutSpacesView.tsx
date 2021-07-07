import { CatalogPageOfferData, IFurnitureData } from 'nitro-renderer';
import { FC, useEffect, useState } from 'react';
import { GetSessionDataManager } from '../../../../../../api';
import { LocalizeText } from '../../../../../../utils/LocalizeText';
import { RoomPreviewerView } from '../../../../../shared/room-previewer/RoomPreviewerView';
import { GetCatalogPageImage, GetCatalogPageText, GetOfferName } from '../../../../common/CatalogUtilities';
import { ProductTypeEnum } from '../../../../common/ProductTypeEnum';
import { useCatalogContext } from '../../../../context/CatalogContext';
import { CatalogPageOffersView } from '../../offers/CatalogPageOffersView';
import { CatalogPurchaseView } from '../../purchase/CatalogPurchaseView';
import { CatalogLayoutSpacesViewProps } from './CatalogLayoutSpacesView.types';

export const CatalogLayoutSpacesView: FC<CatalogLayoutSpacesViewProps> = props =>
{
    const { roomPreviewer = null, pageParser = null } = props;
    const { catalogState } = useCatalogContext();
    const { activeOffer = null } = catalogState;
    const [ groups, setGroups ] = useState<CatalogPageOfferData[][]>([]);
    const [ activeGroupIndex, setActiveGroupIndex ] = useState(-1);

    const groupNames = [ 'floors', 'walls', 'views' ];

    useEffect(() =>
    {
        if(!pageParser) return;
        
        const groupedOffers: CatalogPageOfferData[][] = [ [], [], [] ];
        
        for(const offer of pageParser.offers)
        {
            const product = offer.products[0];

            if(!product) continue;

            let furniData: IFurnitureData = null;

            if(product.productType === ProductTypeEnum.FLOOR)
            {
                furniData = GetSessionDataManager().getFloorItemData(product.furniClassId);
            }

            else if(product.productType === ProductTypeEnum.WALL)
            {
                furniData = GetSessionDataManager().getWallItemData(product.furniClassId);
            }

            if(!furniData) continue;

            const className = furniData.className;

            switch(className)
            {
                case 'floor':
                    groupedOffers[0].push(offer);
                    break;
                case 'wallpaper':
                    groupedOffers[1].push(offer);
                    break;
                case 'landscape':
                    groupedOffers[2].push(offer);
                    break;
            }
        }

        setGroups(groupedOffers);
        setActiveGroupIndex(0);
    }, [ pageParser ]);

    const product = ((activeOffer && activeOffer.products[0]) || null);

    return (
        <div className="row h-100 nitro-catalog-layout-spaces">
            <div className="d-flex col-7 flex-column h-100 overflow-hidden">
                <div className="btn-group mx-auto mb-1 w-100">
                    { groupNames.map((name, index) =>
                        {
                            return <button key={ index } type="button" className={ 'btn btn-primary btn-sm ' + ((activeGroupIndex === index) ? 'active ' : '' )} onClick={ event => setActiveGroupIndex(index) }>{ LocalizeText(`catalog.spaces.tab.${ name }`) }</button>
                        })}
                </div>
                <CatalogPageOffersView offers={ groups[activeGroupIndex] } />
            </div>
            { !product &&
                <div className="position-relative d-flex flex-column col-5 justify-content-center align-items-center">
                    <div className="d-block mb-2">
                        <img alt="" src={ GetCatalogPageImage(pageParser, 1) } />
                    </div>
                    <div className="fs-6 text-center text-black lh-sm overflow-hidden">{ GetCatalogPageText(pageParser, 0) }</div>
                </div> }
            { product &&
                <div className="position-relative d-flex flex-column col">
                    <RoomPreviewerView roomPreviewer={ roomPreviewer } height={ 140 } />
                    <div className="fs-6 text-black mt-1 overflow-hidden">{ GetOfferName(activeOffer) }</div>
                    <CatalogPurchaseView offer={ activeOffer } pageId={ pageParser.pageId } />
                </div> }
        </div>
    );
}
