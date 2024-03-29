import { FrontPageItem } from '@nitrots/nitro-renderer';
import { FC, useMemo } from 'react';
import { GetConfigurationValue } from '../../../../../../api';
import { LayoutBackgroundImage, LayoutBackgroundImageProps } from '../../../../../../common';
import { Text } from '../../../../../../common/Text';

export interface CatalogLayoutFrontPageItemViewProps extends LayoutBackgroundImageProps
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

    const imageUrl = (GetConfigurationValue<string>('image.library.url') + item.itemPromoImage);

    return (
        <LayoutBackgroundImage imageUrl={ imageUrl } classNames={ getClassNames } position={ position } fullHeight={ fullHeight } pointer={ pointer } overflow={ overflow } { ...rest }>
            <Text position="absolute" variant="white" className="bg-dark rounded p-2 m-2 bottom-0">
                { item.itemName }
            </Text>
            { children }
        </LayoutBackgroundImage>
    );
}
