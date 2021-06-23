import { FC } from 'react';
import { GetConfiguration } from '../../../../api';
import { CatalogIconViewProps } from './CatalogIconView.types';

export const CatalogIconView: FC<CatalogIconViewProps> = props =>
{
    const { icon = 0 } = props;

    function getIconUrl(): string
    {
        return ((GetConfiguration<string>('catalog.asset.icon.url')).replace('%name%', icon.toString()));
    }

    const url = `url('${ getIconUrl() }')`;

    return <div className="catalog-icon-image" style={ (url && url.length) ? { backgroundImage: url } : {} }></div>;
}
