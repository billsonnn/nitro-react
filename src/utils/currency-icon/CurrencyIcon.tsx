import { Nitro } from 'nitro-renderer';
import { CurrencyIconProps } from './CurrencyIcon.types';

export function CurrencyIcon(props: CurrencyIconProps): JSX.Element
{
    let url = Nitro.instance.getConfiguration<string>('currency.asset.icon.url', '');
    
    url = url.replace('%type%', props.type.toString());

    url = `url(${ url })`;

    return (
        <div className="nitro-currency-icon" style={ (url && url.length) ? { backgroundImage: url } : {} } />
    );
}
