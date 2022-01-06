import { CatalogGroupsComposer } from '@nitrots/nitro-renderer';
import { FC, useEffect, useState } from 'react';
import { Base } from '../../../../../../common/Base';
import { Column } from '../../../../../../common/Column';
import { Grid } from '../../../../../../common/Grid';
import { SendMessageHook } from '../../../../../../hooks/messages';
import { GetCatalogPageText } from '../../../../common/CatalogUtilities';
import { useCatalogContext } from '../../../../context/CatalogContext';
import { CatalogActions } from '../../../../reducers/CatalogReducer';
import { CatalogSelectGroupView } from '../../../select-group/CatalogSelectGroupView';
import { CatalogProductPreviewView } from '../../product-preview/CatalogProductPreviewView';
import { CatalogLayoutProps } from '../CatalogLayout.types';

export const CatalogLayouGuildForumView: FC<CatalogLayoutProps> = props =>
{
    const { pageParser = null } = props;
    const [ selectedGroupIndex, setSelectedGroupIndex ] = useState<number>(0);
    const { catalogState = null, dispatchCatalogState = null } = useCatalogContext();
    const { activeOffer = null, groups = null } = catalogState;

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
        <Grid>
            <Column className="bg-muted rounded p-2 text-black" size={ 7 } overflow="hidden">
                <Base className="overflow-auto" dangerouslySetInnerHTML={ { __html: GetCatalogPageText(pageParser, 1) } } />
            </Column>
            <Column size={ 5 } overflow="hidden">
                <CatalogProductPreviewView pageParser={ pageParser } activeOffer={ activeOffer } roomPreviewer={ null } extra={ groups[selectedGroupIndex] ? groups[selectedGroupIndex].groupId.toString() : '' } disabled={ !(!!groups[selectedGroupIndex]) }>
                    <CatalogSelectGroupView selectedGroupIndex={ selectedGroupIndex } setSelectedGroupIndex={ setSelectedGroupIndex } />
                </CatalogProductPreviewView>
            </Column>
        </Grid>
    );
}
