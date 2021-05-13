import { FC } from 'react';
import { NitroCardHeaderViewProps } from './NitroCardHeaderView.types';

export const NitroCardHeaderView: FC<NitroCardHeaderViewProps> = props =>
{
    const { headerText = null, onCloseClick = null } = props;

    return (
        <div className="drag-handler d-flex align-items-center bg-primary px-2 py-1 nitro-card-header">
            <div className="d-flex flex-grow-1 justify-content-center align-items-center">
                <div className="h5 m-0 text-white nitro-text-shadow">{ headerText }</div>
            </div>
            <div className="cursor-pointer" onClick={ onCloseClick }>
                <i className="fas fa-times"></i>
            </div>
        </div>
    );
}
