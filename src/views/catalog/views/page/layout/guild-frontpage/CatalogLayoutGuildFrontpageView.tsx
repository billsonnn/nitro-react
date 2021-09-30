import { FC } from 'react';
import { CreateLinkEvent, LocalizeText } from '../../../../../../api';
import { NitroLayoutGrid, NitroLayoutGridColumn } from '../../../../../../layout';
import { NitroLayoutBase } from '../../../../../../layout/base';
import { GetCatalogPageImage, GetCatalogPageText } from '../../../../common/CatalogUtilities';
import { CatalogLayoutGuildFrontpageViewProps } from './CatalogLayoutGuildFrontpageView.types';

export const CatalogLayouGuildFrontpageView: FC<CatalogLayoutGuildFrontpageViewProps> = props =>
{
    const { pageParser = null } = props;
    
    return (
        <NitroLayoutGrid>
            <NitroLayoutGridColumn className="bg-muted rounded p-2 text-black overflow-hidden" size={ 7 }>
                <NitroLayoutBase dangerouslySetInnerHTML={ { __html: GetCatalogPageText(pageParser, 2) } } />
                <NitroLayoutBase className="overflow-auto" dangerouslySetInnerHTML={ { __html: GetCatalogPageText(pageParser, 0) } } />
                <NitroLayoutBase dangerouslySetInnerHTML={ { __html: GetCatalogPageText(pageParser, 1) } } />
            </NitroLayoutGridColumn>
            <NitroLayoutGridColumn size={ 5 }>
                <div className="d-block mb-2">
                    <img alt="" src={ GetCatalogPageImage(pageParser, 1) } />
                </div>
                <div className="col position-relative d-flex flex-column justify-content-center" onClick={ () => CreateLinkEvent('groups/create') }>
                    <button className="btn btn-sm btn-primary mt-1">{ LocalizeText('catalog.start.guild.purchase.button') }</button>
                </div>
            </NitroLayoutGridColumn>
        </NitroLayoutGrid>
    );
}
