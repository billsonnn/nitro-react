import { FC } from 'react';
import { NitroCardHeaderViewProps } from './NitroCardHeaderView.types';

export const NitroCardHeaderView: FC<NitroCardHeaderViewProps> = props =>
{
    const { headerText = null, onCloseClick = null } = props;

    return (
        <div className="drag-handler container-fluid d-flex align-items-center bg-primary py-1 nitro-card-header">
            <div className="d-flex flex-grow-1 justify-content-center align-items-center">
                <div className="h4 m-0 text-white text-shadow">{ headerText }</div>
            </div>
            <div className="cursor-pointer" onClick={ onCloseClick }>
                <i className="fas fa-times"></i>
            </div>
        </div>
    );
}
