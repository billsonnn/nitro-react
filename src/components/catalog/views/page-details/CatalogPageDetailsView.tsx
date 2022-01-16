import { FC } from 'react';
import { NitroLayoutFlexColumn } from '../../../../layout';
import { ICatalogPage } from '../../common/ICatalogPage';

export interface CatalogPageDetailsViewProps
{
    page: ICatalogPage;
}

export const CatalogPageDetailsView: FC<CatalogPageDetailsViewProps> = props =>
{
    const { page = null } = props;

    if(!page) return null;
    
    const imageUrl = page.localization.getImage(1);

    return (
        <NitroLayoutFlexColumn className="justify-content-center align-items-center h-100" overflow="hidden" gap={ 2 }>
            { imageUrl && <img className="" alt="" src={ imageUrl } /> }
            <div className="d-flex flex-column fs-6 text-center text-black lh-sm overflow-auto" dangerouslySetInnerHTML={ { __html: page.localization.getText(0) } } />
        </NitroLayoutFlexColumn>
    );
}
