import { StringDataType } from '@nitrots/nitro-renderer';
import { FC, useCallback, useEffect, useState } from 'react';
import { LocalizeText } from '../../../../../../api';
import { InventoryBadgesUpdatedEvent, SetRoomPreviewerStuffDataEvent } from '../../../../../../events';
import { InventoryBadgesRequestEvent } from '../../../../../../events/inventory/InventoryBadgesRequestEvent';
import { dispatchUiEvent, useUiEvent } from '../../../../../../hooks';
import { NitroLayoutFlexColumn, NitroLayoutGrid, NitroLayoutGridColumn } from '../../../../../../layout';
import { NitroLayoutBase } from '../../../../../../layout/base';
import { NitroCardGridItemView } from '../../../../../../layout/card/grid/item/NitroCardGridItemView';
import { NitroCardGridView } from '../../../../../../layout/card/grid/NitroCardGridView';
import { BadgeImageView } from '../../../../../shared/badge-image/BadgeImageView';
import { useCatalogContext } from '../../../../context/CatalogContext';
import { CatalogPageOffersView } from '../../offers/CatalogPageOffersView';
import { CatalogProductPreviewView } from '../../product-preview/CatalogProductPreviewView';
import { CatalogLayoutBadgeDisplayViewProps } from './CatalogLayoutBadgeDisplayView.types';

export const CatalogLayoutBadgeDisplayView: FC<CatalogLayoutBadgeDisplayViewProps> = props =>
{
    const { roomPreviewer = null, pageParser = null } = props;
    const { catalogState = null, dispatchCatalogState = null } = useCatalogContext();
    const { activeOffer = null } = catalogState;
    const [ badges, setBadges ] = useState<string[]>([]);
    const [ currentBadge, setCurrentBadge ] = useState<string>(null);

    const product = ((activeOffer && activeOffer.products[0]) || null);

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
        <NitroLayoutGrid>
            <NitroLayoutGridColumn size={ 7 }>
                <CatalogPageOffersView className="flex-shrink-0" offers={ pageParser.offers } />
                <NitroLayoutFlexColumn gap={ 1 } overflow="hidden">
                    <NitroLayoutBase className="flex-shrink-0 fw-bold text-black text-truncate">{ LocalizeText('catalog_selectbadge') }</NitroLayoutBase>
                    <NitroCardGridView>
                        { badges && (badges.length > 0) && badges.map(code =>
                            {
                                return (
                                    <NitroCardGridItemView key={ code } itemActive={ (currentBadge === code) } onMouseDown={ event => setCurrentBadge(code) }> 
                                        <BadgeImageView badgeCode={ code } />
                                    </NitroCardGridItemView>
                                );
                            }) }
                    </NitroCardGridView>
                </NitroLayoutFlexColumn>
            </NitroLayoutGridColumn>
            <NitroLayoutGridColumn size={ 5 }>
                <CatalogProductPreviewView pageParser={ pageParser } activeOffer={ activeOffer } roomPreviewer={ roomPreviewer } extra={ currentBadge } disabled={ !currentBadge } />
            </NitroLayoutGridColumn>
        </NitroLayoutGrid>
    );
}
