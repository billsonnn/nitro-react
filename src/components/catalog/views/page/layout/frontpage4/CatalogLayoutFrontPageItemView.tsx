import { FrontPageItem } from '@nitrots/nitro-renderer';
import { FC, useMemo } from 'react';
import { GetConfiguration } from '../../../../../../api';
import { LayoutImage, LayoutImageProps } from '../../../../../../common/layout/LayoutImage';
import { Text } from '../../../../../../common/Text';

export interface CatalogLayoutFrontPageItemViewProps extends LayoutImageProps
{
    item: FrontPageItem;
}

export const CatalogLayoutFrontPageItemView: FC<CatalogLayoutFrontPageItemViewProps> = props =>
{
    const { item = null, position = 'relative', pointer = true, overflow = 'hidden', fullHeight = true, classNames = [], children = null, ...rest } = props;

    const getClassNames = useMemo(() =>
    {
        const newClassNames: string[] = [ 'rounded', 'nitro-front-page-item' ];

        if(classNames.length) newClassNames.push(...classNames);

        return newClassNames;
    }, [ classNames ]);

    if(!item) return null;

    const imageUrl = (GetConfiguration<string>('image.library.url') + item.itemPromoImage);

    return (
        <LayoutImage imageUrl={ imageUrl } classNames={ getClassNames } position={ position } fullHeight={ fullHeight } pointer={ pointer } overflow={ overflow } { ...rest }>
            <Text position="absolute" variant="white" className="bg-dark rounded p-2 m-2 bottom-0">
                { item.itemName }
            </Text>
            { children }
        </LayoutImage>
    );
}
