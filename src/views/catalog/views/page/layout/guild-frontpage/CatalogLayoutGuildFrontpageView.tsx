import { FC } from 'react';
import { CreateLinkEvent, LocalizeText } from '../../../../../../api';
import { GetCatalogPageImage, GetCatalogPageText } from '../../../../common/CatalogUtilities';
import { useCatalogContext } from '../../../../context/CatalogContext';
import { CatalogLayoutGuildFrontpageViewProps } from './CatalogLayoutGuildFrontpageView.types';

export const CatalogLayouGuildFrontpageView: FC<CatalogLayoutGuildFrontpageViewProps> = props =>
{
    const { pageParser = null } = props;

    const { catalogState = null, dispatchCatalogState = null } = useCatalogContext();
    
    return (
        <div className="row h-100 nitro-catalog-layout-guild-custom-furni">
            <div className="col-7 overflow-auto h-100 d-flex flex-column bg-muted rounded py-1 px-2 text-black">
                <div dangerouslySetInnerHTML={ { __html: GetCatalogPageText(pageParser, 2) } } />
                <div dangerouslySetInnerHTML={ { __html: GetCatalogPageText(pageParser, 0) } } />
                <div dangerouslySetInnerHTML={ { __html: GetCatalogPageText(pageParser, 1) } } />
                <div className="d-block mb-2">
                    <img alt="" src={ GetCatalogPageImage(pageParser, 1) } />
                </div>
            </div>
            <div className="col position-relative d-flex flex-column justify-content-center" onClick={ () => CreateLinkEvent('groups/create') }>
                <button className="btn btn-sm btn-primary mt-1">{ LocalizeText('catalog.start.guild.purchase.button') }</button>
            </div>
        </div>
    );
}
