import { FC, useMemo } from 'react';
import { GetConfiguration } from '../../../api';
import { CurrencyIconProps } from './CurrencyIcon.types';

export const CurrencyIcon: FC<CurrencyIconProps> = props =>
{
    const { type = '', className = '', style = {}, ...rest } = props;

    const urlString = useMemo(() =>
    {
        let url = GetConfiguration<string>('currency.asset.icon.url', '');
    
        url = url.replace('%type%', type.toString());

        return `url(${ url })`;
    }, [ type ]);

    return (
        <div className={ 'nitro-currency-icon ' + className } style={ { ...style, backgroundImage: urlString } } { ...rest } />
    );
}
