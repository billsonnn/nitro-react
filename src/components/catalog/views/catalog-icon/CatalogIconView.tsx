import { FC, useMemo } from 'react';
import { GetConfiguration } from '../../../../api';
import { LayoutImage } from '../../../../common/layout/LayoutImage';

export interface CatalogIconViewProps
{
    icon: number;
}

export const CatalogIconView: FC<CatalogIconViewProps> = props =>
{
    const { icon = 0 } = props;

    const getIconUrl = useMemo(() =>
    {
        return ((GetConfiguration<string>('catalog.asset.icon.url')).replace('%name%', icon.toString()));
    }, [ icon ]);

    return <LayoutImage imageUrl={ getIconUrl } style={ { width: 20, height: 20 } } />;
}
