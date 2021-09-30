import { CatalogGroupsComposer } from '@nitrots/nitro-renderer';
import { FC, useEffect, useState } from 'react';
import { SendMessageHook } from '../../../../../../hooks/messages';
import { NitroLayoutGrid, NitroLayoutGridColumn } from '../../../../../../layout';
import { NitroLayoutBase } from '../../../../../../layout/base';
import { GetCatalogPageText } from '../../../../common/CatalogUtilities';
import { useCatalogContext } from '../../../../context/CatalogContext';
import { CatalogActions } from '../../../../reducers/CatalogReducer';
import { CatalogSelectGroupView } from '../../../select-group/CatalogSelectGroupView';
import { CatalogProductPreviewView } from '../../product-preview/CatalogProductPreviewView';
import { CatalogLayoutGuildForumViewProps } from './CatalogLayoutGuildForumView.types';

export const CatalogLayouGuildForumView: FC<CatalogLayoutGuildForumViewProps> = props =>
{
    const { pageParser = null } = props;

    const { catalogState = null, dispatchCatalogState = null } = useCatalogContext();
    const { activeOffer = null, groups = null } = catalogState;

    const [ selectedGroupIndex, setSelectedGroupIndex ] = useState<number>(0);

    const product = ((activeOffer && activeOffer.products[0]) || null);

    useEffect(() =>
    {
        SendMessageHook(new CatalogGroupsComposer());

        if(pageParser.offers.length > 0)
        {
            dispatchCatalogState({
                type: CatalogActions.SET_CATALOG_ACTIVE_OFFER,
                payload: {
                    activeOffer: pageParser.offers[0]
                }
            });
        }
    }, [ dispatchCatalogState, pageParser ]);
    
    return (
        <NitroLayoutGrid>
            <NitroLayoutGridColumn className="bg-muted rounded p-2 text-black overflow-hidden" size={ 7 }>
                <NitroLayoutBase className="overflow-auto" dangerouslySetInnerHTML={ { __html: GetCatalogPageText(pageParser, 1) } } />
            </NitroLayoutGridColumn>
            <NitroLayoutGridColumn size={ 5 }>
                <CatalogProductPreviewView pageParser={ pageParser } activeOffer={ activeOffer } roomPreviewer={ null } extra={ groups[selectedGroupIndex] ? groups[selectedGroupIndex].groupId.toString() : '' } disabled={ !(!!groups[selectedGroupIndex]) }>
                    <CatalogSelectGroupView selectedGroupIndex={ selectedGroupIndex } setSelectedGroupIndex={ setSelectedGroupIndex } />
                </CatalogProductPreviewView>
            </NitroLayoutGridColumn>
        </NitroLayoutGrid>
    );
}
