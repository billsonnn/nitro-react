import { FC } from 'react';
import { Base } from '../../../../../../common/Base';
import { Column } from '../../../../../../common/Column';
import { Flex } from '../../../../../../common/Flex';
import { GetCatalogPageImage, GetCatalogPageText } from '../../../../common/CatalogUtilities';
import { CatalogLayoutProps } from '../CatalogLayout.types';

export const CatalogLayoutPets3View: FC<CatalogLayoutProps> = props =>
{
    const { pageParser = null } = props;

    const imageUrl = GetCatalogPageImage(pageParser, 1);
    
    return (
        <Column grow className="bg-muted rounded text-black p-2" overflow="hidden">
            <Flex alignItems="center" gap={ 2 }>
                { imageUrl && <img alt="" src={ GetCatalogPageImage(pageParser, 1) } /> }
                <Base className="fs-5" dangerouslySetInnerHTML={ { __html: GetCatalogPageText(pageParser, 1) } } />
            </Flex>
            <Column grow alignItems="center" overflow="auto">
                <Base dangerouslySetInnerHTML={ { __html: GetCatalogPageText(pageParser, 2) } } />
            </Column>
            <Flex alignItems="center">
                <Base className="fw-bold" dangerouslySetInnerHTML={ { __html: GetCatalogPageText(pageParser, 3) } } />
            </Flex>
        </Column>
    );
}
