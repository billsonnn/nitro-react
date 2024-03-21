import { FC, useMemo } from 'react';
import { GetConfigurationValue } from '../../../../api';
import { LayoutImage } from '../../../../common';

export interface CatalogIconViewProps
{
    icon: number;
}

export const CatalogIconView: FC<CatalogIconViewProps> = props =>
{
    const { icon = 0 } = props;

    const getIconUrl = useMemo(() =>
    {
        return ((GetConfigurationValue<string>('catalog.asset.icon.url')).replace('%name%', icon.toString()));
    }, [ icon ]);

    return <LayoutImage imageUrl={ getIconUrl } style={ { width: 20, height: 20 } } />;
}
