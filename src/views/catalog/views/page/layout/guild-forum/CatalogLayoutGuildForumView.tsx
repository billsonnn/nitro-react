import { CatalogGroupsComposer } from '@nitrots/nitro-renderer';
import { FC, useEffect } from 'react';
import { SendMessageHook } from '../../../../../../hooks/messages';
import { LocalizeText } from '../../../../../../utils/LocalizeText';
import { GetCatalogPageText } from '../../../../common/CatalogUtilities';
import { useCatalogContext } from '../../../../context/CatalogContext';
import { CatalogActions } from '../../../../reducers/CatalogReducer';
import { CatalogLayoutGuildForumViewProps } from './CatalogLayoutGuildForumView.types';

export const CatalogLayouGuildForumView: FC<CatalogLayoutGuildForumViewProps> = props =>
{
    const { pageParser = null } = props;

    const { catalogState = null, dispatchCatalogState = null } = useCatalogContext();
    const { activeOffer = null, groups = null } = catalogState;

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
        <div className="row h-100 nitro-catalog-layout-guild-custom-furni">
            <div className="col-7 overflow-auto h-100 d-flex flex-column bg-muted rounded py-1 px-2 text-black">
                <div dangerouslySetInnerHTML={ { __html: GetCatalogPageText(pageParser, 1) } } />
            </div>
            <div className="col position-relative d-flex flex-column justify-content-center">
                { groups.length === 0 && <div className="bg-muted text-center rounded p-1 text-black">
                        { LocalizeText('catalog.guild_selector.members_only') }
                    <button className="btn btn-sm btn-primary mt-1">{ LocalizeText('catalog.guild_selector.find_groups') }</button>
                </div> }
            </div>
        </div>
        );
}
