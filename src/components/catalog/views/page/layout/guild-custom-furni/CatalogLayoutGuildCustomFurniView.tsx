import { CatalogGroupsComposer, StringDataType } from '@nitrots/nitro-renderer';
import { FC, useEffect, useMemo, useState } from 'react';
import { Column } from '../../../../../../common/Column';
import { Grid } from '../../../../../../common/Grid';
import { SetRoomPreviewerStuffDataEvent } from '../../../../../../events';
import { dispatchUiEvent } from '../../../../../../hooks';
import { SendMessageHook } from '../../../../../../hooks/messages';
import { useCatalogContext } from '../../../../context/CatalogContext';
import { CatalogSelectGroupView } from '../../../select-group/CatalogSelectGroupView';
import { CatalogProductPreviewView } from '../../offers/CatalogPageOfferPreviewView';
import { CatalogPageOffersView } from '../../offers/CatalogPageOffersView';
import { CatalogLayoutProps } from '../CatalogLayout.types';

export const CatalogLayouGuildCustomFurniView: FC<CatalogLayoutProps> = props =>
{
    const { page = null, roomPreviewer = null } = props;
    const [ selectedGroupIndex, setSelectedGroupIndex ] = useState<number>(0);
    const { currentOffer = null, catalogState = null } = useCatalogContext();
    const { groups = null } = catalogState;

    const selectedGroup = useMemo(() =>
    {
        if(!groups || !groups.length) return;

        return groups[selectedGroupIndex];
    }, [ groups, selectedGroupIndex ]);

    useEffect(() =>
    {
        if(!page) return;

        SendMessageHook(new CatalogGroupsComposer());
    }, [ page ]);

    useEffect(() =>
    {
        if(!currentOffer || !groups[selectedGroupIndex]) return;

        const productData = [];

        productData.push('0');
        productData.push(groups[selectedGroupIndex].groupId);
        productData.push(groups[selectedGroupIndex].badgeCode);
        productData.push(groups[selectedGroupIndex].colorA);
        productData.push(groups[selectedGroupIndex].colorB);

        const stringDataType = new StringDataType();
        stringDataType.setValue(productData);

        dispatchUiEvent(new SetRoomPreviewerStuffDataEvent(currentOffer, stringDataType));
    }, [ groups, currentOffer, selectedGroupIndex ]);

    if(!groups) return null;
    
    return (
        <Grid>
            <Column size={ 7 } overflow="hidden">
                <CatalogPageOffersView offers={ page.offers } />
            </Column>
            <Column size={ 5 } overflow="hidden">
                { !!currentOffer &&
                    <CatalogProductPreviewView offer={ currentOffer } roomPreviewer={ roomPreviewer } badgeCode={ ((selectedGroup && selectedGroup.badgeCode) || null) } extra={ groups[selectedGroupIndex] ? groups[selectedGroupIndex].groupId.toString() : '' } disabled={ !(!!groups[selectedGroupIndex]) }>
                        <CatalogSelectGroupView selectedGroupIndex={ selectedGroupIndex } setSelectedGroupIndex={ setSelectedGroupIndex } />
                    </CatalogProductPreviewView> }
            </Column>
        </Grid>
    );
}
