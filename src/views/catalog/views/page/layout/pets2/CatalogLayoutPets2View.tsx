import { FC } from 'react';
import { GetCatalogPageImage, GetCatalogPageText } from '../../../../utils/CatalogUtilities';
import { CatalogLayoutPets2ViewProps } from './CatalogLayoutPets2View.types';

export const CatalogLayoutPets2View: FC<CatalogLayoutPets2ViewProps> = props =>
{
    const { pageParser = null } = props;
    
    return (
        <div className="h-100 nitro-catalog-layout-pets3 bg-muted p-1 rounded text-black">
            <div className="overflow-auto h-100 d-flex flex-column">
                <div className="d-flex flex-row">
                    <div className="d-block mb-1 me-1">
                        <img alt="" src={ GetCatalogPageImage(pageParser, 1) } />
                    </div>
                    <h6 className="align-self-center">{ GetCatalogPageText(pageParser, 1) }</h6>
                </div>
                <div dangerouslySetInnerHTML={ {__html: GetCatalogPageText(pageParser, 2) } } />
                {GetCatalogPageText(pageParser, 3) && <div className="mt-auto bg-secondary text-white rounded p-1 text-center" dangerouslySetInnerHTML={{ __html: GetCatalogPageText(pageParser, 3) }} />}
            </div>
        </div>
    );
}
