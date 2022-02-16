import { CatalogGroupsComposer } from '@nitrots/nitro-renderer';
import { FC, useEffect, useState } from 'react';
import { Base } from '../../../../../common/Base';
import { Column } from '../../../../../common/Column';
import { Flex } from '../../../../../common/Flex';
import { Grid } from '../../../../../common/Grid';
import { Text } from '../../../../../common/Text';
import { SendMessageHook } from '../../../../../hooks/messages';
import { useCatalogContext } from '../../../CatalogContext';
import { CatalogFirstProductSelectorWidgetView } from '../widgets/CatalogFirstProductSelectorWidgetView';
import { CatalogGuildSelectorWidgetView } from '../widgets/CatalogGuildSelectorWidgetView';
import { CatalogPurchaseWidgetView } from '../widgets/CatalogPurchaseWidgetView';
import { CatalogTotalPriceWidget } from '../widgets/CatalogTotalPriceWidget';
import { CatalogLayoutProps } from './CatalogLayout.types';

export const CatalogLayouGuildForumView: FC<CatalogLayoutProps> = props =>
{
    const { page = null } = props;
    const [ selectedGroupIndex, setSelectedGroupIndex ] = useState<number>(0);
    const { currentOffer = null, setCurrentOffer = null, catalogOptions = null } = useCatalogContext();
    const { groups = null } = catalogOptions;

    useEffect(() =>
    {
        SendMessageHook(new CatalogGroupsComposer());
    }, [ page ]);
    
    return (
        <>
            <CatalogFirstProductSelectorWidgetView />
            <Grid>
                <Column className="bg-muted rounded p-2 text-black" size={ 7 } overflow="hidden">
                    <Base className="overflow-auto" dangerouslySetInnerHTML={ { __html: page.localization.getText(1) } } />
                </Column>
                <Column size={ 5 } overflow="hidden" gap={ 1 }>
                    { !!currentOffer &&
                        <>
                            <Column grow gap={ 1 }>
                                <Text truncate>{ currentOffer.localizationName }</Text>
                                <Base grow>
                                    <CatalogGuildSelectorWidgetView />
                                </Base>
                                <Flex justifyContent="end">
                                    <CatalogTotalPriceWidget alignItems="end" />
                                </Flex>
                                <CatalogPurchaseWidgetView noGiftOption={ true } />
                            </Column>
                        </> }
                </Column>
            </Grid>
        </>
    );
}
