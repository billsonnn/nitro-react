import { FC, useEffect, useState } from 'react';
import { LocalizeText } from '../../../../../../api';
import { Button } from '../../../../../../common/Button';
import { ButtonGroup } from '../../../../../../common/ButtonGroup';
import { Column } from '../../../../../../common/Column';
import { Grid } from '../../../../../../common/Grid';
import { BatchUpdates } from '../../../../../../hooks';
import { IPurchasableOffer } from '../../../../common/IPurchasableOffer';
import { useCatalogContext } from '../../../../context/CatalogContext';
import { CatalogProductPreviewView } from '../../offers/CatalogPageOfferPreviewView';
import { CatalogPageOffersView } from '../../offers/CatalogPageOffersView';
import { CatalogLayoutProps } from '../CatalogLayout.types';

export const CatalogLayoutSpacesView: FC<CatalogLayoutProps> = props =>
{
    const { page = null, roomPreviewer = null } = props;
    const [ groups, setGroups ] = useState<IPurchasableOffer[][]>([]);
    const [ activeGroupIndex, setActiveGroupIndex ] = useState(-1);
    const { currentOffer = null, catalogState } = useCatalogContext();

    const groupNames = [ 'floors', 'walls', 'views' ];

    useEffect(() =>
    {
        if(!page) return;
        
        const groupedOffers: IPurchasableOffer[][] = [ [], [], [] ];
        
        for(const offer of page.offers)
        {
            const product = offer.product

            if(!product) continue;

            if(!product.furnitureData) continue;

            const className = product.furnitureData.className;

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

        BatchUpdates(() =>
        {
            setGroups(groupedOffers);
            setActiveGroupIndex(0);
        });
    }, [ page ]);

    return (
        <Grid>
            <Column size={ 7 } overflow="hidden">
                <ButtonGroup>
                    { groupNames.map((name, index) => <Button key={ index } active={ (activeGroupIndex === index) } onClick={ event => setActiveGroupIndex(index) }>{ LocalizeText(`catalog.spaces.tab.${ name }`) }</Button>)}
                </ButtonGroup>
                <CatalogPageOffersView offers={ groups[activeGroupIndex] } />
            </Column>
            <Column size={ 5 } overflow="hidden">
                { !!currentOffer &&
                    <CatalogProductPreviewView offer={ currentOffer } roomPreviewer={ roomPreviewer } /> }
            </Column>
        </Grid>
    );
}
