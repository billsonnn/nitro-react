import { FC } from 'react';
import { NitroCardTabsViewProps } from './NitroCardTabsView.types';

export const NitroCardTabsView: FC<NitroCardTabsViewProps> = props =>
{
    return (
        <div className="container-fluid d-flex bg-secondary pt-1 nitro-card-tabs justify-content-center">
            <ul className="nav nav-tabs">
                { props.children }
            </ul>
        </div>
    );
}
