import { FC } from 'react';
import { NitroCardTabsViewProps } from './NitroCardTabsView.types';

export const NitroCardTabsView: FC<NitroCardTabsViewProps> = props =>
{
    return (
        <div className="container-fluid d-flex pt-1 nitro-card-tabs justify-content-center">
            <ul className="nav nav-tabs border-0 gap-1">
                { props.children }
            </ul>
        </div>
    );
}
