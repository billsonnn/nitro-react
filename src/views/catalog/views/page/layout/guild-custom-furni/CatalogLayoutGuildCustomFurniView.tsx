import { CatalogGroupsComposer } from 'nitro-renderer';
import { FC, useEffect } from 'react';
import { SendMessageHook } from '../../../../../../hooks/messages';
import { LocalizeText } from '../../../../../../utils/LocalizeText';
import { GetOfferName } from '../../../../common/CatalogUtilities';
import { useCatalogContext } from '../../../../context/CatalogContext';
import { CatalogRoomPreviewerView } from '../../../catalog-room-previewer/CatalogRoomPreviewerView';
import { CatalogPageOffersView } from '../../offers/CatalogPageOffersView';
import { CatalogPurchaseView } from '../../purchase/CatalogPurchaseView';
import { CatalogLayoutGuildCustomFurniViewProps } from './CatalogLayoutGuildCustomFurniView.types';

export const CatalogLayouGuildCustomFurniView: FC<CatalogLayoutGuildCustomFurniViewProps> = props =>
{
    const { roomPreviewer = null, pageParser = null } = props;

    const { catalogState = null } = useCatalogContext();
    const { activeOffer = null, groups = null } = catalogState;

    const product = ((activeOffer && activeOffer.products[0]) || null);

    useEffect(() =>
    {
        SendMessageHook(new CatalogGroupsComposer());
    }, [ pageParser ]);
    
    return (
        <div className="row h-100 nitro-catalog-layout-guild-custom-furni">
            <div className="d-flex flex-column col-7 h-100">
                <CatalogPageOffersView offers={ pageParser.offers } />
            </div>
            { product &&
            <div className="col position-relative d-flex flex-column">
                <CatalogRoomPreviewerView roomPreviewer={ roomPreviewer } height={ 140 } />
                <div className="fs-6 text-black mt-1 overflow-hidden">{ GetOfferName(activeOffer) }</div>
                { groups.length === 0 && <div className="bg-muted text-center rounded p-1 text-black mt-auto">
                    { LocalizeText('catalog.guild_selector.members_only') }
                    <button className="btn btn-sm btn-primary mt-1">{ LocalizeText('catalog.guild_selector.find_groups') }</button>
                </div> }
                { groups.length > 0 && <CatalogPurchaseView offer={ activeOffer } pageId={ pageParser.pageId } /> }
            </div> }
        </div>
        );
}
