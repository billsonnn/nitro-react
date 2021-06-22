import { FC } from 'react';
import { NitroCardSimpleHeaderViewProps } from './NitroCardSimpleHeaderView.types';

export const NitroCardSimpleHeaderView: FC<NitroCardSimpleHeaderViewProps> = props =>
{
    const { headerText = null, onCloseClick = null } = props;

    return (
        <div className='container-fluid bg-light'>
            <div className="row nitro-card-header">
                <div className="d-flex justify-content-center align-items-center w-100 position-relative">
                    <div className="h5 text-white text-center text-shadow bg-tertiary-split border-top-0 rounded-bottom px-2 py-1 drag-handler">{ headerText }</div>
                    <div className="position-absolute header-close" onMouseDown={ event => event.stopPropagation() } onClick={ onCloseClick }>
                        <i className="fas fa-times" />
                    </div>
                </div>
            </div>
        </div>
    );
}
