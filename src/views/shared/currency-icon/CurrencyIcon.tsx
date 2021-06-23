import { FC } from 'react';
import { GetConfiguration } from '../../../api';
import { CurrencyIconProps } from './CurrencyIcon.types';

export const CurrencyIcon: FC<CurrencyIconProps> = props =>
{
    let url = GetConfiguration<string>('currency.asset.icon.url', '');
    
    url = url.replace('%type%', props.type.toString());

    url = `url(${ url })`;

    return (
        <div className="nitro-currency-icon" style={ (url && url.length) ? { backgroundImage: url } : {} } />
    );
}
