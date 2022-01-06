import { CatalogPageMessageOfferData, IFurnitureData } from '@nitrots/nitro-renderer';
import { FC, useEffect, useState } from 'react';
import { GetSessionDataManager, LocalizeText } from '../../../../../../api';
import { Button } from '../../../../../../common/Button';
import { ButtonGroup } from '../../../../../../common/ButtonGroup';
import { Column } from '../../../../../../common/Column';
import { Grid } from '../../../../../../common/Grid';
import { ProductTypeEnum } from '../../../../common/ProductTypeEnum';
import { useCatalogContext } from '../../../../context/CatalogContext';
import { CatalogPageOffersView } from '../../offers/CatalogPageOffersView';
import { CatalogProductPreviewView } from '../../product-preview/CatalogProductPreviewView';
import { CatalogLayoutProps } from '../CatalogLayout.types';

export const CatalogLayoutSpacesView: FC<CatalogLayoutProps> = props =>
{
    const { roomPreviewer = null, pageParser = null } = props;
    const [ groups, setGroups ] = useState<CatalogPageMessageOfferData[][]>([]);
    const [ activeGroupIndex, setActiveGroupIndex ] = useState(-1);
    const { catalogState } = useCatalogContext();
    const { activeOffer = null } = catalogState;

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
        <Grid>
            <Column size={ 7 } overflow="hidden">
                <ButtonGroup>
                    { groupNames.map((name, index) => <Button key={ index } size="sm" active={ (activeGroupIndex === index) } onClick={ event => setActiveGroupIndex(index) }>{ LocalizeText(`catalog.spaces.tab.${ name }`) }</Button>)}
                </ButtonGroup>
                <CatalogPageOffersView offers={ groups[activeGroupIndex] } />
            </Column>
            <Column size={ 5 } overflow="hidden">
                <CatalogProductPreviewView pageParser={ pageParser } activeOffer={ activeOffer } roomPreviewer={ roomPreviewer } />
            </Column>
        </Grid>
    );
}
