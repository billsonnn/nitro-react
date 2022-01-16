import { StringDataType } from '@nitrots/nitro-renderer';
import { FC, useCallback, useEffect, useState } from 'react';
import { LocalizeText } from '../../../../../../api';
import { Column } from '../../../../../../common/Column';
import { Grid } from '../../../../../../common/Grid';
import { LayoutGridItem } from '../../../../../../common/layout/LayoutGridItem';
import { Text } from '../../../../../../common/Text';
import { InventoryBadgesUpdatedEvent, SetRoomPreviewerStuffDataEvent } from '../../../../../../events';
import { InventoryBadgesRequestEvent } from '../../../../../../events/inventory/InventoryBadgesRequestEvent';
import { dispatchUiEvent, useUiEvent } from '../../../../../../hooks';
import { BadgeImageView } from '../../../../../../views/shared/badge-image/BadgeImageView';
import { useCatalogContext } from '../../../../context/CatalogContext';
import { CatalogProductPreviewView } from '../../offers/CatalogPageOfferPreviewView';
import { CatalogPageOffersView } from '../../offers/CatalogPageOffersView';
import { CatalogLayoutProps } from '../CatalogLayout.types';

export const CatalogLayoutBadgeDisplayView: FC<CatalogLayoutProps> = props =>
{
    const { page = null, roomPreviewer = null } = props;
    const [ badges, setBadges ] = useState<string[]>([]);
    const [ currentBadge, setCurrentBadge ] = useState<string>(null);
    const { currentOffer = null } = useCatalogContext();

    const onInventoryBadgesUpdatedEvent = useCallback((event: InventoryBadgesUpdatedEvent) =>
    {
        setBadges(event.badges);
    }, []);

    useUiEvent(InventoryBadgesUpdatedEvent.BADGES_UPDATED, onInventoryBadgesUpdatedEvent);

    useEffect(() =>
    {
        dispatchUiEvent(new InventoryBadgesRequestEvent(InventoryBadgesRequestEvent.REQUEST_BADGES));
    }, []);

    useEffect(() =>
    {
        if(!currentBadge || !currentOffer) return;

        const productData = [];

        productData.push('0');
        productData.push(currentBadge);
        productData.push('');
        productData.push('');
        productData.push('');

        const stringDataType = new StringDataType();
        stringDataType.setValue(productData);

        dispatchUiEvent(new SetRoomPreviewerStuffDataEvent(currentOffer, stringDataType));
    }, [ currentBadge, currentOffer, roomPreviewer ]);

    return (
        <Grid>
            <Column size={ 7 } overflow="hidden">
                <CatalogPageOffersView shrink offers={ page.offers } />
                <Column gap={ 1 } overflow="hidden">
                    <Text truncate shrink fontWeight="bold">{ LocalizeText('catalog_selectbadge') }</Text>
                    <Grid grow columnCount={ 5 } overflow="auto">
                        { badges && (badges.length > 0) && badges.map(code =>
                            {
                                return (
                                    <LayoutGridItem key={ code } itemActive={ (currentBadge === code) } onMouseDown={ event => setCurrentBadge(code) }> 
                                        <BadgeImageView badgeCode={ code } />
                                    </LayoutGridItem>
                                );
                            }) }
                    </Grid>
                </Column>
            </Column>
            <Column size={ 5 } overflow="hidden">
                { !!currentOffer &&
                    <CatalogProductPreviewView offer={ currentOffer } roomPreviewer={ roomPreviewer } extra={ currentBadge } disabled={ !currentBadge } /> }
            </Column>
        </Grid>
    );
}
