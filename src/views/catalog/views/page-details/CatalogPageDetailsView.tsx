import { FC } from 'react';
import { GetCatalogPageImage, GetCatalogPageText } from '../../common/CatalogUtilities';
import { CatalogPageDetailsViewProps } from './CatalogPageDetailsView.types';

export const CatalogPageDetailsView: FC<CatalogPageDetailsViewProps> = props =>
{
    const { pageParser = null } = props;

    if(!pageParser) return null;

    const imageUrl = GetCatalogPageImage(pageParser, 1);

    return (
        <div className="d-flex flex-column justify-content-center align-items-center gap-2 w-100 h-100">
            { imageUrl && <img alt="" src={ imageUrl } /> }
            <div className="d-flex flex-column fs-6 text-center text-black lh-sm" dangerouslySetInnerHTML={ { __html: GetCatalogPageText(pageParser, 0) } } />
        </div>
    );
}
