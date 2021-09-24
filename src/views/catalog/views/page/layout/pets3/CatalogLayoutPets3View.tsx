import { FC } from 'react';
import { GetCatalogPageImage, GetCatalogPageText } from '../../../../common/CatalogUtilities';
import { CatalogLayoutPets3ViewProps } from './CatalogLayoutPets3View.types';

export const CatalogLayoutPets3View: FC<CatalogLayoutPets3ViewProps> = props =>
{
    const { pageParser = null } = props;

    const imageUrl = GetCatalogPageImage(pageParser, 1);
    
    return (
        <div className="row h-100">
            <div className="d-flex flex-column col-12 h-100">
                <div className="d-flex flex-column bg-muted rounded text-black gap-2 p-2 h-100">
                    <div className="d-flex flex-row align-items-center gap-2">
                        { imageUrl && <img alt="" src={ GetCatalogPageImage(pageParser, 1) } /> }
                        <div className="fs-5" dangerouslySetInnerHTML={ { __html: GetCatalogPageText(pageParser, 1) } } />
                    </div>
                    <div className="d-flex flex-column align-items-center flex-grow-1 overflow-auto">
                        <div dangerouslySetInnerHTML={ { __html: GetCatalogPageText(pageParser, 2) } } />
                    </div>
                    <div className="d-flex flex-row align-items-center">
                        <div className="fw-bold" dangerouslySetInnerHTML={ { __html: GetCatalogPageText(pageParser, 3) } } />
                    </div>
                </div>
            </div>
        </div>
    );
}
