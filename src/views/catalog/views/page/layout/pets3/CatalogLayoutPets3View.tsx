import { FC } from 'react';
import { GetCatalogPageImage, GetCatalogPageText } from '../../../../utils/CatalogUtilities';
import { CatalogLayoutPets3ViewProps } from './CatalogLayoutPets3View.types';

export const CatalogLayoutPets3View: FC<CatalogLayoutPets3ViewProps> = props =>
{
    const { pageParser = null } = props;
    
    return (
        <div className="row h-100 nitro-catalog-layout-pets3">
            <div className="col-7">
                <div className="" dangerouslySetInnerHTML={ {__html: GetCatalogPageText(pageParser, 1) } } />
                <div className="" dangerouslySetInnerHTML={ {__html: GetCatalogPageText(pageParser, 2) } } />
                <div className="" dangerouslySetInnerHTML={ {__html: GetCatalogPageText(pageParser, 3) } } />
            </div>
            <div className="position-relative d-flex flex-column col-5 justify-content-center align-items-center">
                <div className="d-block mb-2">
                    <img alt="" src={ GetCatalogPageImage(pageParser, 1) } />
                </div>
                <div className="fs-6 text-center text-black lh-sm overflow-hidden">{ GetCatalogPageText(pageParser, 0) }</div>
            </div>
        </div>
    );
}
