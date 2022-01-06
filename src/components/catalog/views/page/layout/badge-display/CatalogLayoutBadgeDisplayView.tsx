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
import { CatalogPageOffersView } from '../../offers/CatalogPageOffersView';
import { CatalogProductPreviewView } from '../../product-preview/CatalogProductPreviewView';
import { CatalogLayoutProps } from '../CatalogLayout.types';

export const CatalogLayoutBadgeDisplayView: FC<CatalogLayoutProps> = props =>
{
    const { roomPreviewer = null, pageParser = null } = props;
    const [ badges, setBadges ] = useState<string[]>([]);
    const [ currentBadge, setCurrentBadge ] = useState<string>(null);
    const { catalogState = null } = useCatalogContext();
    const { activeOffer = null } = catalogState;

    const onInventoryBadgesUpdatedEvent = useCallback((event: InventoryBadgesUpdatedEvent) =>
    {
        console.log(event);
        setBadges(event.badges);
    }, []);

    useUiEvent(InventoryBadgesUpdatedEvent.BADGES_UPDATED, onInventoryBadgesUpdatedEvent);

    useEffect(() =>
    {
        dispatchUiEvent(new InventoryBadgesRequestEvent(InventoryBadgesRequestEvent.REQUEST_BADGES));
    }, []);

    useEffect(() =>
    {
        if(!currentBadge || !activeOffer) return;

        const productData = [];
        productData.push('0');
        productData.push(currentBadge);
        productData.push('');
        productData.push('');
        productData.push('');

        const stringDataType = new StringDataType();
        stringDataType.setValue(productData);

        dispatchUiEvent(new SetRoomPreviewerStuffDataEvent(activeOffer, stringDataType));
    }, [ currentBadge, activeOffer, roomPreviewer ]);

    return (
        <Grid>
            <Column size={ 7 } overflow="hidden">
                <CatalogPageOffersView shrink offers={ pageParser.offers } />
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
                <CatalogProductPreviewView pageParser={ pageParser } activeOffer={ activeOffer } roomPreviewer={ roomPreviewer } extra={ currentBadge } disabled={ !currentBadge } />
            </Column>
        </Grid>
    );
}
