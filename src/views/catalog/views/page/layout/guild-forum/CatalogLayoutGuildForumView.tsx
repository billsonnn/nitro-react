import { CatalogGroupsComposer } from '@nitrots/nitro-renderer';
import { FC, useEffect, useState } from 'react';
import { LocalizeText } from '../../../../../../api';
import { SendMessageHook } from '../../../../../../hooks/messages';
import { BadgeImageView } from '../../../../../shared/badge-image/BadgeImageView';
import { GetCatalogPageText } from '../../../../common/CatalogUtilities';
import { useCatalogContext } from '../../../../context/CatalogContext';
import { CatalogActions } from '../../../../reducers/CatalogReducer';
import { CatalogPurchaseView } from '../../purchase/CatalogPurchaseView';
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
        <div className="row h-100 nitro-catalog-layout-guild-custom-furni">
            <div className="col-7 overflow-auto h-100 d-flex flex-column bg-muted rounded py-1 px-2 text-black">
                <div dangerouslySetInnerHTML={ { __html: GetCatalogPageText(pageParser, 1) } } />
            </div>
            { product && <div className="col position-relative d-flex flex-column justify-content-center align-items-center">
                { groups.length === 0 && <div className="bg-muted text-center rounded p-1 text-black">
                        { LocalizeText('catalog.guild_selector.members_only') }
                    <button className="btn btn-sm btn-primary mt-1">{ LocalizeText('catalog.guild_selector.find_groups') }</button>
                </div> }
                { groups[selectedGroupIndex] && <div style={{ width: '50px', height: '50px', zIndex: 1 }}>
                    <BadgeImageView badgeCode={ groups[selectedGroupIndex].badgeCode } isGroup={ true } />
                    </div> }
                { groups.length > 0 && <>
                    <div className="d-flex mb-2 w-100">
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
                    { groups[selectedGroupIndex].hasForum && <div className="bg-primary p-1 text-center rounded">{ LocalizeText('catalog.alert.group_has_forum') }</div> }
                    <CatalogPurchaseView offer={ activeOffer } pageId={ pageParser.pageId } extra={ groups[selectedGroupIndex] ? groups[selectedGroupIndex].groupId.toString() : '' } />
                </> }
            </div> }
        </div>
        );
}
