import { FC } from 'react';
import { Column } from '../../../../../common';
import { CatalogLayoutProps } from './CatalogLayout.types';

export const CatalogLayoutPets3View: FC<CatalogLayoutProps> = props =>
{
    const { page = null } = props;

    const imageUrl = page.localization.getImage(1);

    return (
        <Column grow className="bg-muted rounded text-black p-2" overflow="hidden">
            <div className="items-center gap-2">
                { imageUrl && <img alt="" src={ imageUrl } /> }
                <div className="fs-5" dangerouslySetInnerHTML={ { __html: page.localization.getText(1) } } />
            </div>
            <Column grow alignItems="center" overflow="auto">
                <div dangerouslySetInnerHTML={ { __html: page.localization.getText(2) } } />
            </Column>
            <div className="flex items-center">
                <div className="font-bold	" dangerouslySetInnerHTML={ { __html: page.localization.getText(3) } } />
            </div>
        </Column>
    );
};
