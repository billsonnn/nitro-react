import { FC } from 'react';
import { NitroCardSimpleHeaderViewProps } from './NitroCardSimpleHeaderView.types';

export const NitroCardSimpleHeaderView: FC<NitroCardSimpleHeaderViewProps> = props =>
{
    const { headerText = null, onCloseClick = null } = props;

    return (
        <div className="d-flex container-fluid align-items-center bg-light pb-1">
            <div className="d-flex bg-tertiary-split flex-grow-1 justify-content-center align-items-center border-top-0 rounded-bottom px-2 py-1 drag-handler">
                <div className="h5 m-0 text-white text-shadow">{ headerText }</div>
            </div>
            <div className="position-absolute nitro-close" onMouseDown={ event => event.stopPropagation() } onClick={ onCloseClick }>
                <i className="fas fa-times" />
            </div>
        </div>
    );
}
