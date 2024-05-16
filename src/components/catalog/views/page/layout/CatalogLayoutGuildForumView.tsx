import { CatalogGroupsComposer } from '@nitrots/nitro-renderer';
import { FC, useEffect, useState } from 'react';
import { SendMessageComposer } from '../../../../../api';
import { Column, Grid, Text } from '../../../../../common';
import { useCatalog } from '../../../../../hooks';
import { CatalogFirstProductSelectorWidgetView } from '../widgets/CatalogFirstProductSelectorWidgetView';
import { CatalogGuildSelectorWidgetView } from '../widgets/CatalogGuildSelectorWidgetView';
import { CatalogPurchaseWidgetView } from '../widgets/CatalogPurchaseWidgetView';
import { CatalogTotalPriceWidget } from '../widgets/CatalogTotalPriceWidget';
import { CatalogLayoutProps } from './CatalogLayout.types';

export const CatalogLayouGuildForumView: FC<CatalogLayoutProps> = props =>
{
    const { page = null } = props;
    const [selectedGroupIndex, setSelectedGroupIndex] = useState<number>(0);
    const { currentOffer = null, setCurrentOffer = null, catalogOptions = null } = useCatalog();
    const { groups = null } = catalogOptions;

    useEffect(() =>
    {
        SendMessageComposer(new CatalogGroupsComposer());
    }, [page]);

    return (
        <>
            <CatalogFirstProductSelectorWidgetView />
            <Grid>
                <Column className="bg-muted rounded p-2 text-black" overflow="hidden" size={7}>
                    <div className="overflow-auto" dangerouslySetInnerHTML={{ __html: page.localization.getText(1) }} />
                </Column>
                <Column gap={1} overflow="hidden" size={5}>
                    {!!currentOffer &&
                        <>
                            <Column grow gap={1}>
                                <Text truncate>{currentOffer.localizationName}</Text>
                                <div className="!flex-grow">
                                    <CatalogGuildSelectorWidgetView />
                                </div>
                                <div className="flex justify-end">
                                    <CatalogTotalPriceWidget alignItems="end" />
                                </div>
                                <CatalogPurchaseWidgetView noGiftOption={true} />
                            </Column>
                        </>}
                </Column>
            </Grid>
        </>
    );
}
