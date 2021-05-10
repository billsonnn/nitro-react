import { FC } from 'react';
import { NitroCardTabsViewProps } from './NitroCardTabsView.types';

export const NitroCardTabsView: FC<NitroCardTabsViewProps> = props =>
{
    return (
        <ul className="nav nav-tabs justify-content-center bg-secondary px-2 pt-1 nitro-card-tabs">
            { props.children }
        </ul>
    );
}
