import { FC } from 'react';
import { CatalogLayoutDefaultViewProps } from './CatalogLayoutDefaultView.types';

export const CatalogLayoutDefaultView: FC<CatalogLayoutDefaultViewProps> = props =>
{
    const { pageParser = null } = props;

    return (
        <div className="d-flex">
            { pageParser && pageParser.localization.texts[0] }
        </div>
    );
}
