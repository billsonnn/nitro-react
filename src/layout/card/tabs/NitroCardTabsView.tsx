import { FC } from 'react';
import { NitroCardTabsViewProps } from './NitroCardTabsView.types';

export const NitroCardTabsView: FC<NitroCardTabsViewProps> = props =>
{
    return (
        <ul className="nav nav-tabs justify-content-center bg-secondary border-start border-end px-3 pt-1">
            { props.children }
        </ul>
    );
}
