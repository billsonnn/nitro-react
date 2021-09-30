import { CatalogGroupsComposer, StringDataType } from '@nitrots/nitro-renderer';
import { FC, useEffect, useMemo, useState } from 'react';
import { SetRoomPreviewerStuffDataEvent } from '../../../../../../events';
import { dispatchUiEvent } from '../../../../../../hooks';
import { SendMessageHook } from '../../../../../../hooks/messages';
import { NitroLayoutGrid, NitroLayoutGridColumn } from '../../../../../../layout';
import { useCatalogContext } from '../../../../context/CatalogContext';
import { CatalogSelectGroupView } from '../../../select-group/CatalogSelectGroupView';
import { CatalogPageOffersView } from '../../offers/CatalogPageOffersView';
import { CatalogProductPreviewView } from '../../product-preview/CatalogProductPreviewView';
import { CatalogLayoutGuildCustomFurniViewProps } from './CatalogLayoutGuildCustomFurniView.types';

export const CatalogLayouGuildCustomFurniView: FC<CatalogLayoutGuildCustomFurniViewProps> = props =>
{
    const { roomPreviewer = null, pageParser = null } = props;
    const [ selectedGroupIndex, setSelectedGroupIndex ] = useState<number>(0);
    const { catalogState = null } = useCatalogContext();
    const { activeOffer = null, groups = null } = catalogState;

    const selectedGroup = useMemo(() =>
    {
        if(!groups || !groups.length) return;

        return groups[selectedGroupIndex];
    }, [ groups, selectedGroupIndex ]);

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
    
    return (
        <NitroLayoutGrid>
            <NitroLayoutGridColumn size={ 7 }>
                <CatalogPageOffersView offers={ pageParser.offers } />
            </NitroLayoutGridColumn>
            <NitroLayoutGridColumn size={ 5 }>
                <CatalogProductPreviewView pageParser={ pageParser } activeOffer={ activeOffer } roomPreviewer={ roomPreviewer } badgeCode={ ((selectedGroup && selectedGroup.badgeCode) || null) } extra={ groups[selectedGroupIndex] ? groups[selectedGroupIndex].groupId.toString() : '' } disabled={ !(!!groups[selectedGroupIndex]) }>
                    <CatalogSelectGroupView selectedGroupIndex={ selectedGroupIndex } setSelectedGroupIndex={ setSelectedGroupIndex } />
                </CatalogProductPreviewView>
            </NitroLayoutGridColumn>
        </NitroLayoutGrid>
    );
}
