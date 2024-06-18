import { FC, useEffect, useState } from 'react';
import { GetConfigurationValue } from '../../../../api';

export interface CatalogHeaderViewProps
{
    imageUrl?: string;
}

export const CatalogHeaderView: FC<CatalogHeaderViewProps> = props =>
{
    const { imageUrl = null } = props;
    const [ displayImageUrl, setDisplayImageUrl ] = useState('');

    useEffect(() =>
    {
        setDisplayImageUrl(imageUrl ?? GetConfigurationValue<string>('catalog.asset.image.url').replace('%name%', 'catalog_header_roombuilder'));
    }, [ imageUrl ]);

    return <div className="flex justify-center items-center w-full nitro-catalog-header">
        <img src={ displayImageUrl } onError={ ({ currentTarget }) =>
        {
            currentTarget.src = GetConfigurationValue<string>('catalog.asset.image.url').replace('%name%', 'catalog_header_roombuilder');
        } } />
    </div>;
};
