import { CatalogGroupsComposer, StringDataType } from '@nitrots/nitro-renderer';
import { FC, useEffect, useState } from 'react';
import { LocalizeText } from '../../../../../../api';
import { SetRoomPreviewerStuffDataEvent } from '../../../../../../events';
import { dispatchUiEvent } from '../../../../../../hooks';
import { SendMessageHook } from '../../../../../../hooks/messages';
import { BadgeImageView } from '../../../../../shared/badge-image/BadgeImageView';
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
    
    const [ selectedGroupIndex, setSelectedGroupIndex ] = useState<number>(0);

    useEffect(() =>
    {
        SendMessageHook(new CatalogGroupsComposer());
    }, [ pageParser ]);

    useEffect(() =>
    {
        if(!activeOffer || !groups[selectedGroupIndex]) return;

        const productData = [];
        productData.push('0');
        productData.push(groups[selectedGroupIndex].groupId);
        productData.push(groups[selectedGroupIndex].badgeCode);
        productData.push(groups[selectedGroupIndex].colorA);
        productData.push(groups[selectedGroupIndex].colorB);

        const stringDataType = new StringDataType();
        stringDataType.setValue(productData);

        dispatchUiEvent(new SetRoomPreviewerStuffDataEvent(activeOffer, stringDataType));
    }, [ groups, selectedGroupIndex, activeOffer ]);

    if(!groups) return null;

    const product = ((activeOffer && activeOffer.products[0]) || null);
    
    return (
        <div className="row h-100 nitro-catalog-layout-guild-custom-furni">
            <div className="d-flex flex-column col-7 h-100">
                <CatalogPageOffersView offers={ pageParser.offers } />
            </div>
            { product &&
            <div className="col position-relative d-flex flex-column">
                { groups[selectedGroupIndex] && <div className="position-absolute" style={{ width: '50px', height: '50px', zIndex: 1 }}>
                    <BadgeImageView badgeCode={ groups[selectedGroupIndex].badgeCode } isGroup={ true } />
                    </div> }
                <CatalogRoomPreviewerView roomPreviewer={ roomPreviewer } height={ 140 } />
                <div className="fs-6 text-black mt-1 overflow-hidden">{ GetOfferName(activeOffer) }</div>
                { groups.length === 0 && <div className="bg-muted text-center rounded p-1 text-black mt-auto">
                    { LocalizeText('catalog.guild_selector.members_only') }
                    <button className="btn btn-sm btn-primary mt-1">{ LocalizeText('catalog.guild_selector.find_groups') }</button>
                </div> }
                { groups.length > 0 && <>
                    <div className="d-flex mb-2">
                        <div className="rounded d-flex overflow-hidden me-1 border">
                            <div className="h-100" style={{ width: '20px', backgroundColor: '#' + groups[selectedGroupIndex].colorA }}></div>
                            <div className="h-100" style={{ width: '20px', backgroundColor: '#' + groups[selectedGroupIndex].colorB }}></div>
                        </div>
                        <select className="form-select form-select-sm" value={ selectedGroupIndex } onChange={ (e) => setSelectedGroupIndex(parseInt(e.target.value)) }>
                            { groups.map((group, index) =>
                            {
                                return <option key={ index } value={ index }>{ group.groupName }</option>;
                            }) }
                        </select>
                    </div>
                    <CatalogPurchaseView offer={ activeOffer } pageId={ pageParser.pageId } extra={ groups[selectedGroupIndex] ? groups[selectedGroupIndex].groupId.toString() : '' } />
                </> }
            </div> }
        </div>
        );
}
