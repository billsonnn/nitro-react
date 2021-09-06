import { CatalogGroupsComposer, HabboGroupEntryData } from '@nitrots/nitro-renderer';
import { FC, useEffect, useState } from 'react';
import { GetSessionDataManager, LocalizeText } from '../../../../../../api';
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
    const [ availableGroups, setAvailableGroups ] = useState<HabboGroupEntryData[]>([]);

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

    useEffect(() =>
    {
        const available: HabboGroupEntryData[] = [];

        groups.forEach((group) =>
        {
            if(!group.hasForum && group.ownerId === GetSessionDataManager().userId) available.push(group);
        });

        setAvailableGroups(available);
    }, [ groups ]);
    
    return (
        <div className="row h-100 nitro-catalog-layout-guild-custom-furni">
            <div className="col-7 overflow-auto h-100 d-flex flex-column bg-muted rounded py-1 px-2 text-black">
                <div dangerouslySetInnerHTML={ { __html: GetCatalogPageText(pageParser, 1) } } />
            </div>
            <div className="col position-relative d-flex flex-column justify-content-center align-items-center">
                { availableGroups.length === 0 && <div className="bg-muted text-center rounded p-1 text-black">
                        { LocalizeText('catalog.guild_selector.members_only') }
                    <button className="btn btn-sm btn-primary mt-1">{ LocalizeText('catalog.guild_selector.find_groups') }</button>
                </div> }
                { availableGroups[selectedGroupIndex] && <div style={{ width: '50px', height: '50px', zIndex: 1 }}>
                    <BadgeImageView badgeCode={ availableGroups[selectedGroupIndex].badgeCode } isGroup={ true } />
                    </div> }
                { availableGroups.length > 0 && <>
                    <div className="d-flex mb-2 w-100">
                        <div className="rounded d-flex overflow-hidden me-1 border">
                            <div className="h-100" style={{ width: '20px', backgroundColor: '#' + availableGroups[selectedGroupIndex].colorA }}></div>
                            <div className="h-100" style={{ width: '20px', backgroundColor: '#' + availableGroups[selectedGroupIndex].colorB }}></div>
                        </div>
                        <select className="form-select form-select-sm" value={ selectedGroupIndex } onChange={ (e) => setSelectedGroupIndex(parseInt(e.target.value)) }>
                            { availableGroups.map((group, index) =>
                            {
                                return <option key={ index } value={ index }>{ group.groupName }</option>;
                            }) }
                        </select>
                    </div>
                    <CatalogPurchaseView offer={ activeOffer } pageId={ pageParser.pageId } extra={ availableGroups[selectedGroupIndex] ? availableGroups[selectedGroupIndex].groupId.toString() : '' } />
                </> }
            </div>
        </div>
        );
}
