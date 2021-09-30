import { FC, useMemo } from 'react';
import { GetConfiguration } from '../../../../../../../api';
import { NitroLayoutBase } from '../../../../../../../layout/base';
import { CatalogLayoutFrontPageItemViewProps } from './CatalogLayoutFrontPageItemView.types';

export const CatalogLayoutFrontPageItemView: FC<CatalogLayoutFrontPageItemViewProps> = props =>
{
    const { item = null, className = '', style = null, ...rest } = props;

    const getClassName = useMemo(() =>
    {
        let newClassName = 'position-relative rounded h-100 nitro-front-page-item';

        if(className && className.length) newClassName += ' ' + className;

        return newClassName;
    }, [ className ]);

    const getStyle = useMemo(() =>
    {
        const newStyle = { ...style };

        newStyle.backgroundImage = `url('${ GetConfiguration<string>('image.library.url') }${ item.itemPromoImage }')`;

        return newStyle;
    }, [ style, item ]);

    if(!item) return null;

    return (
        <NitroLayoutBase className={ getClassName } style={ getStyle } { ...rest }>
            <div className="front-page-item-caption">{ item.itemName }</div>
        </NitroLayoutBase>
    );
}
