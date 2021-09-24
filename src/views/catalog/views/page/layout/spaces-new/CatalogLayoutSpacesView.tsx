import { CatalogPageMessageOfferData, IFurnitureData } from '@nitrots/nitro-renderer';
import { FC, useEffect, useState } from 'react';
import { GetSessionDataManager, LocalizeText } from '../../../../../../api';
import { ProductTypeEnum } from '../../../../common/ProductTypeEnum';
import { useCatalogContext } from '../../../../context/CatalogContext';
import { CatalogPageOffersView } from '../../offers/CatalogPageOffersView';
import { CatalogProductPreviewView } from '../../product-preview/CatalogProductPreviewView';
import { CatalogLayoutSpacesViewProps } from './CatalogLayoutSpacesView.types';

export const CatalogLayoutSpacesView: FC<CatalogLayoutSpacesViewProps> = props =>
{
    const { roomPreviewer = null, pageParser = null } = props;
    const { catalogState } = useCatalogContext();
    const { activeOffer = null } = catalogState;
    const [ groups, setGroups ] = useState<CatalogPageMessageOfferData[][]>([]);
    const [ activeGroupIndex, setActiveGroupIndex ] = useState(-1);

    const groupNames = [ 'floors', 'walls', 'views' ];

    useEffect(() =>
    {
        if(!pageParser) return;
        
        const groupedOffers: CatalogPageMessageOfferData[][] = [ [], [], [] ];
        
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
        <div className="row h-100">
            <div className="d-flex flex-column col-7 gap-2 h-100">
                <div className="btn-group w-100">
                    { groupNames.map((name, index) =>
                        {
                            return <button key={ index } type="button" className={ 'btn btn-primary btn-sm ' + ((activeGroupIndex === index) ? 'active ' : '' )} onClick={ event => setActiveGroupIndex(index) }>{ LocalizeText(`catalog.spaces.tab.${ name }`) }</button>
                        })}
                </div>
                <CatalogPageOffersView offers={ groups[activeGroupIndex] } />
            </div>
            <div className="position-relative d-flex flex-column col-5">
                <CatalogProductPreviewView pageParser={ pageParser } activeOffer={ activeOffer } roomPreviewer={ roomPreviewer } />
            </div>
        </div>
    );
}
