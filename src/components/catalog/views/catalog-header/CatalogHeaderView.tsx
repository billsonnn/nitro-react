import { FC, useEffect, useMemo, useRef } from 'react';
import { GetConfiguration } from '../../../../api';
import { Base } from '../../../../common';

export interface CatalogHeaderViewProps
{
    image?: string;
}

export const CatalogHeaderView: FC<CatalogHeaderViewProps> = props =>
{
    let { image = null } = props;

    const imageEl = useRef<HTMLImageElement>();

    const fallback = useMemo(()=>
    {
        return ((GetConfiguration<string>('catalog.asset.image.url')).replace('%name%', 'catalog_header_roombuilder'));
    },[])

    useEffect(()=> 
    {
        if(image == null && imageEl !== null) imageEl.current.src = fallback;
    },[ image, imageEl,fallback ])

    return <Base className="nitro-catalog-header">
        <img ref={ imageEl } src={ image } onError={ ({ currentTarget }) => 
        {
            currentTarget.src = fallback;
        }
        } />
    </Base>;
}
