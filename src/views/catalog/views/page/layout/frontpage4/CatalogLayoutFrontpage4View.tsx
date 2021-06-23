import { FC, useCallback, useMemo } from 'react';
import { GetConfiguration } from '../../../../../../api';
import { CatalogLayoutFrontpage4ViewProps } from './CatalogLayoutFrontpage4View.types';

export const CatalogLayoutFrontpage4View: FC<CatalogLayoutFrontpage4ViewProps> = props =>
{
    const { pageParser = null } = props;

    const getFrontPageItem = useCallback((position: number) =>
    {
        for(const item of pageParser.frontPageItems)
        {
            if(item.position !== position) continue;

            return item;
        }
    }, [ pageParser ]);

    const getFrontPageItemImage = useCallback((position: number) =>
    {
        const item = getFrontPageItem(position);

        if(!item) return null;

        return item.itemPromoImage;
    }, [ getFrontPageItem ]);

    const imageLibraryUrl = useMemo(() =>
    {
        return GetConfiguration<string>('image.library.url');
    }, []);

    if(!pageParser) return null;

    return (
        <div className="row h-100 nitro-catalog-layout-frontpage4">
            <div className="col-4">
                { pageParser.frontPageItems[0] &&
                    <div className="front-page-item h-100" style={ { backgroundImage: `url('${ imageLibraryUrl }${ pageParser.frontPageItems[0].itemPromoImage }')`}}>
                        <div className="front-page-item-caption">{ pageParser.frontPageItems[0].itemName }</div>
                    </div> }
            </div>
            <div className="d-flex col-8 flex-column">
                { pageParser.frontPageItems[1] &&
                    <div className="front-page-item h-100 mb-2" style={ { backgroundImage: `url('${ imageLibraryUrl }${ pageParser.frontPageItems[1].itemPromoImage }')`}}>
                        <div className="front-page-item-caption">{ pageParser.frontPageItems[1].itemName }</div>
                    </div> }
                { pageParser.frontPageItems[2] &&
                    <div className="front-page-item h-100 mb-2" style={ { backgroundImage: `url('${ imageLibraryUrl }${ pageParser.frontPageItems[2].itemPromoImage }')`}}>
                        <div className="front-page-item-caption">{ pageParser.frontPageItems[2].itemName }</div>
                    </div> }
                { pageParser.frontPageItems[3] &&
                    <div className="front-page-item h-100" style={ { backgroundImage: `url('${ imageLibraryUrl }${ pageParser.frontPageItems[3].itemPromoImage }')`}}>
                        <div className="front-page-item-caption">{ pageParser.frontPageItems[3].itemName }</div>
                    </div> }
            </div>
        </div>
    );
}
