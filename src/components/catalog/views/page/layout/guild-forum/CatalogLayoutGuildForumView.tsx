import { CatalogGroupsComposer } from '@nitrots/nitro-renderer';
import { FC, useEffect, useState } from 'react';
import { Base } from '../../../../../../common/Base';
import { Column } from '../../../../../../common/Column';
import { Grid } from '../../../../../../common/Grid';
import { SendMessageHook } from '../../../../../../hooks/messages';
import { useCatalogContext } from '../../../../context/CatalogContext';
import { CatalogSelectGroupView } from '../../../select-group/CatalogSelectGroupView';
import { CatalogProductPreviewView } from '../../offers/CatalogPageOfferPreviewView';
import { CatalogLayoutProps } from '../CatalogLayout.types';

export const CatalogLayouGuildForumView: FC<CatalogLayoutProps> = props =>
{
    const { page = null } = props;
    const [ selectedGroupIndex, setSelectedGroupIndex ] = useState<number>(0);
    const { currentOffer = null, setCurrentOffer = null, catalogState = null, dispatchCatalogState = null } = useCatalogContext();
    const { groups = null } = catalogState;

    useEffect(() =>
    {
        SendMessageHook(new CatalogGroupsComposer());

        if(page.offers.length) setCurrentOffer(page.offers[0]);
    }, [ page, setCurrentOffer ]);
    
    return (
        <Grid>
            <Column className="bg-muted rounded p-2 text-black" size={ 7 } overflow="hidden">
                <Base className="overflow-auto" dangerouslySetInnerHTML={ { __html: page.localization.getText(1) } } />
            </Column>
            <Column size={ 5 } overflow="hidden">
                { !!currentOffer &&
                    <CatalogProductPreviewView offer={ currentOffer } roomPreviewer={ null } extra={ groups[selectedGroupIndex] ? groups[selectedGroupIndex].groupId.toString() : '' } disabled={ !(!!groups[selectedGroupIndex]) }>
                        <CatalogSelectGroupView selectedGroupIndex={ selectedGroupIndex } setSelectedGroupIndex={ setSelectedGroupIndex } />
                    </CatalogProductPreviewView> }
            </Column>
        </Grid>
    );
}
