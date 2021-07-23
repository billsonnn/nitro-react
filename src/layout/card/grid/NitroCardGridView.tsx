import { FC } from 'react';
import { NitroCardGridContextProvider } from './context/NitroCardGridContext';
import { NitroCardGridThemes, NitroCardGridViewProps } from './NitroCardGridView.types';

export const NitroCardGridView: FC<NitroCardGridViewProps> = props =>
{
    const { columns = 5, theme = NitroCardGridThemes.THEME_DEFAULT, className = '', children = null, ...rest } = props;

    return (
        <NitroCardGridContextProvider value={ { theme } }>
            <div className={ `h-100 overflow-hidden nitro-card-grid ${ theme } ${ className || '' }` } { ...rest }>
                <div className={ `row row-cols-${ columns } align-content-start g-0 w-100 h-100 overflow-auto` }>
                    { children }
                </div>
            </div>
        </NitroCardGridContextProvider>
    );
}
