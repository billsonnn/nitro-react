import { IFurnitureData, RoomPreviewer } from '@nitrots/nitro-renderer';
import { FC } from 'react';
import { Base } from '../../../../../common/Base';
import { Column } from '../../../../../common/Column';
import { Grid } from '../../../../../common/Grid';
import { Text } from '../../../../../common/Text';
import { LimitedEditionCompletePlateView } from '../../../../../views/shared/limited-edition/LimitedEditionCompletePlateView';
import { GetOfferName } from '../../../common/CatalogUtilities';
import { useCatalogContext } from '../../../context/CatalogContext';
import { CatalogRoomPreviewerView } from '../../catalog-room-previewer/CatalogRoomPreviewerView';
import { CatalogPurchaseView } from '../purchase/CatalogPurchaseView';
import { CatalogSearchResultOffersView } from './CatalogSearchResultOffersView';

export interface CatalogLayoutSearchResultViewProps
{
    roomPreviewer: RoomPreviewer;
    furnitureDatas: IFurnitureData[];
}

export const CatalogLayoutSearchResultView: FC<CatalogLayoutSearchResultViewProps> = props =>
{
    const { roomPreviewer = null, furnitureDatas = null } = props;
    const { catalogState } = useCatalogContext();
    const { activeOffer = null } = catalogState;

    const product = ((activeOffer && activeOffer.products[0]) || null);

    return (
        <Grid>
            <Column size={ 7 } overflow="hidden">
                <CatalogSearchResultOffersView offers={ furnitureDatas } />
            </Column>
            { product &&
                <Column size={ 5 } overflow="hidden">
                    <Column overflow="hidden" position="relative" gap={ 0 }>
                        { roomPreviewer && <CatalogRoomPreviewerView roomPreviewer={ roomPreviewer } height={ 140 } /> }
                        { product.uniqueLimitedItem &&
                            <Base fullWidth position="absolute" className="top-1">
                                <LimitedEditionCompletePlateView className="mx-auto" uniqueLimitedItemsLeft={ product.uniqueLimitedItemsLeft } uniqueLimitedSeriesSize={ product.uniqueLimitedSeriesSize } />
                            </Base> }
                    </Column>
                    <Column grow>
                        <Text grow truncate>{ GetOfferName(activeOffer) }</Text>
                        <CatalogPurchaseView offer={ activeOffer } pageId={ -1 } />
                    </Column>
                </Column> }
        </Grid>
    );
}
