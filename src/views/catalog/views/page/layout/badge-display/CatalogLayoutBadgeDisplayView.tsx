import { StringDataType } from '@nitrots/nitro-renderer';
import { FC, useCallback, useEffect, useState } from 'react';
import { LocalizeText } from '../../../../../../api';
import { InventoryBadgesUpdatedEvent, SetRoomPreviewerStuffDataEvent } from '../../../../../../events';
import { InventoryBadgesRequestEvent } from '../../../../../../events/inventory/InventoryBadgesRequestEvent';
import { dispatchUiEvent, useUiEvent } from '../../../../../../hooks';
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
        <div className="row h-100">
            <div className="d-flex flex-column col-7 gap-2 h-100">
                <CatalogPageOffersView className="flex-shrink-0" offers={ pageParser.offers } />
                <div className="d-flex flex-column overflow-hidden">
                    <div className="text-black fw-bold">{ LocalizeText('catalog_selectbadge') }</div>
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
                </div>
            </div>
            <div className="position-relative d-flex flex-column col-5">
                <CatalogProductPreviewView pageParser={ pageParser } activeOffer={ activeOffer } roomPreviewer={ roomPreviewer } extra={ currentBadge } disabled={ !currentBadge } />
            </div>
        </div>
    );
}
