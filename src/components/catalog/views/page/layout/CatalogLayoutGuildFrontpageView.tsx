import { CreateLinkEvent } from '@nitrots/nitro-renderer';
import { FC } from 'react';
import { LocalizeText } from '../../../../../api';
import { Button } from '../../../../../common/Button';
import { Column } from '../../../../../common/Column';
import { Grid } from '../../../../../common/Grid';
import { LayoutImage } from '../../../../../common/layout/LayoutImage';
import { CatalogLayoutProps } from './CatalogLayout.types';

export const CatalogLayouGuildFrontpageView: FC<CatalogLayoutProps> = props =>
{
    const { page = null } = props;

    return (
        <Grid>
            <Column className="bg-muted rounded p-2 text-black" overflow="hidden" size={ 7 }>
                <div dangerouslySetInnerHTML={ { __html: page.localization.getText(2) } } />
                <div className="overflow-auto" dangerouslySetInnerHTML={ { __html: page.localization.getText(0) } } />
                <div dangerouslySetInnerHTML={ { __html: page.localization.getText(1) } } />
            </Column>
            <Column center overflow="hidden" size={ 5 }>
                <LayoutImage imageUrl={ page.localization.getImage(1) } />
                <Button onClick={ () => CreateLinkEvent('groups/create') }>
                    { LocalizeText('catalog.start.guild.purchase.button') }
                </Button>
            </Column>
        </Grid>
    );
};
