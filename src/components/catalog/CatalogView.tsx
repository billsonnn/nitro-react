import { ILinkEventTracker } from '@nitrots/nitro-renderer';
import { FC, useEffect } from 'react';
import { AddEventLinkTracker, GetConfiguration, LocalizeText, RemoveLinkEventTracker } from '../../api';
import { Column, Flex, Grid, NitroCardContentView, NitroCardHeaderView, NitroCardTabsItemView, NitroCardTabsView, NitroCardView } from '../../common';
import { useCatalog } from '../../hooks';
import { CatalogIconView } from './views/catalog-icon/CatalogIconView';
import { CatalogGiftView } from './views/gift/CatalogGiftView';
import { CatalogNavigationView } from './views/navigation/CatalogNavigationView';
import { GetCatalogLayout } from './views/page/layout/GetCatalogLayout';
import { MarketplacePostOfferView } from './views/page/layout/marketplace/MarketplacePostOfferView';

export const CatalogView: FC<{}> = props =>
{
    const { isVisible = false, setIsVisible = null, rootNode = null, currentPage = null, navigationHidden = false, setNavigationHidden = null, activeNodes = [], searchResult = null, setSearchResult = null, openPageByName = null, openPageByOfferId = null, activateNode = null, getNodeById } = useCatalog();

    useEffect(() =>
    {
        const linkTracker: ILinkEventTracker = {
            linkReceived: (url: string) =>
            {
                const parts = url.split('/');
        
                if(parts.length < 2) return;
        
                switch(parts[1])
                {
                    case 'show':
                        setIsVisible(true);
                        return;
                    case 'hide':
                        setIsVisible(false);
                        return;
                    case 'toggle':
                        setIsVisible(prevValue => !prevValue);
                        return;
                    case 'open':
                        if(parts.length > 2)
                        {
                            if(parts.length === 4)
                            {
                                switch(parts[2])
                                {
                                    case 'offerId':
                                        openPageByOfferId(parseInt(parts[3]));
                                        return;
                                }
                            }
                            else
                            {
                                openPageByName(parts[2]);
                            }
                        }
                        else
                        {
                            setIsVisible(true);
                        }
        
                        return;
                }
            },
            eventUrlPrefix: 'catalog/'
        };

        AddEventLinkTracker(linkTracker);

        return () => RemoveLinkEventTracker(linkTracker);
    }, [ setIsVisible, openPageByOfferId, openPageByName ]);

    return (
        <>
            { isVisible &&
                <NitroCardView uniqueKey="catalog" className="nitro-catalog" style={ GetConfiguration('catalog.headers') ? { width: 710 } : {} }>
                    <NitroCardHeaderView headerText={ LocalizeText('catalog.title') } onCloseClick={ event => setIsVisible(false) } />
                    <NitroCardTabsView>
                        { rootNode && (rootNode.children.length > 0) && rootNode.children.map(child =>
                        {
                            if(!child.isVisible) return null;

                            return (
                                <NitroCardTabsItemView key={ child.pageId } isActive={ child.isActive } onClick={ event =>
                                {
                                    if(searchResult) setSearchResult(null);

                                    activateNode(child);
                                } } >
                                    <Flex gap={ GetConfiguration('catalog.tab.icons') ? 1 : 0 } alignItems="center">
                                        { GetConfiguration('catalog.tab.icons') && <CatalogIconView icon={ child.iconId } /> }
                                        { child.localization }
                                    </Flex>
                                </NitroCardTabsItemView>
                            );
                        }) }
                    </NitroCardTabsView>
                    <NitroCardContentView>
                        <Grid>
                            { !navigationHidden &&
                                <Column size={ 3 } overflow="hidden">
                                    { activeNodes && (activeNodes.length > 0) &&
                                        <CatalogNavigationView node={ activeNodes[0] } /> }
                                </Column> }
                            <Column size={ !navigationHidden ? 9 : 12 } overflow="hidden">
                                { GetCatalogLayout(currentPage, () => setNavigationHidden(true)) }
                            </Column>
                        </Grid>
                    </NitroCardContentView>
                </NitroCardView> }
            <CatalogGiftView />
            <MarketplacePostOfferView />
        </>
    );
}
