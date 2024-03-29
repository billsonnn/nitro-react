import { CSSProperties, FC, useMemo } from 'react';
import { GetConfigurationValue } from '../../api';
import { Base, BaseProps } from '../Base';

export interface CurrencyIconProps extends BaseProps<HTMLDivElement>
{
    type: number | string;
}

export const LayoutCurrencyIcon: FC<CurrencyIconProps> = props =>
{
    const { type = '', classNames = [], style = {}, ...rest } = props;

    const getClassNames = useMemo(() =>
    {
        const newClassNames: string[] = [ 'nitro-currency-icon' ];

        if(classNames.length) newClassNames.push(...classNames);

        return newClassNames;
    }, [ classNames ]);

    const urlString = useMemo(() =>
    {
        let url = GetConfigurationValue<string>('currency.asset.icon.url', '');
    
        url = url.replace('%type%', type.toString());

        return `url(${ url })`;
    }, [ type ]);

    const getStyle = useMemo(() =>
    {
        let newStyle: CSSProperties = {};

        newStyle.backgroundImage = urlString;

        if(Object.keys(style).length) newStyle = { ...newStyle, ...style };

        return newStyle;
    }, [ style, urlString ]);

    return <Base classNames={ getClassNames } style={ getStyle } { ...rest } />
}
