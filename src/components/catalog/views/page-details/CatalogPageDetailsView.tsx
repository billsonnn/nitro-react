import { FC } from 'react';
import { NitroLayoutFlexColumn } from '../../../../layout';
import { GetCatalogPageImage, GetCatalogPageText } from '../../common/CatalogUtilities';
import { CatalogPageDetailsViewProps } from './CatalogPageDetailsView.types';

export const CatalogPageDetailsView: FC<CatalogPageDetailsViewProps> = props =>
{
    const { pageParser = null } = props;

    if(!pageParser) return null;

    const imageUrl = GetCatalogPageImage(pageParser, 1);

    return (
        <NitroLayoutFlexColumn className="justify-content-center align-items-center h-100" overflow="hidden" gap={ 2 }>
            { imageUrl && <img className="" alt="" src={ imageUrl } /> }
            <div className="d-flex flex-column fs-6 text-center text-black lh-sm overflow-auto" dangerouslySetInnerHTML={ { __html: GetCatalogPageText(pageParser, 0) } } />
        </NitroLayoutFlexColumn>
    );
}
