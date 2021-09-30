import { FC } from 'react';
import { NitroLayoutFlex, NitroLayoutFlexColumn, NitroLayoutGrid, NitroLayoutGridColumn } from '../../../../../../layout';
import { NitroLayoutBase } from '../../../../../../layout/base';
import { GetCatalogPageImage, GetCatalogPageText } from '../../../../common/CatalogUtilities';
import { CatalogLayoutPets3ViewProps } from './CatalogLayoutPets3View.types';

export const CatalogLayoutPets3View: FC<CatalogLayoutPets3ViewProps> = props =>
{
    const { pageParser = null } = props;

    const imageUrl = GetCatalogPageImage(pageParser, 1);
    
    return (
        <NitroLayoutGrid>
            <NitroLayoutGridColumn className="bg-muted rounded text-black p-2" overflow="hidden" size={ 12 }>
                <NitroLayoutFlex className="align-items-center" gap={ 2 }>
                    { imageUrl && <img alt="" src={ GetCatalogPageImage(pageParser, 1) } /> }
                    <NitroLayoutBase className="fs-5" dangerouslySetInnerHTML={ { __html: GetCatalogPageText(pageParser, 1) } } />
                </NitroLayoutFlex>
                <NitroLayoutFlexColumn className="align-items-center flex-grow-1" overflow="auto">
                    <NitroLayoutBase dangerouslySetInnerHTML={ { __html: GetCatalogPageText(pageParser, 2) } } />
                </NitroLayoutFlexColumn>
                <NitroLayoutFlex className="align-items-center">
                    <NitroLayoutBase className="fw-bold" dangerouslySetInnerHTML={ { __html: GetCatalogPageText(pageParser, 3) } } />
                </NitroLayoutFlex>
            </NitroLayoutGridColumn>
        </NitroLayoutGrid>
    );
}
