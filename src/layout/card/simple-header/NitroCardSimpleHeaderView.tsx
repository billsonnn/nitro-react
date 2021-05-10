import { FC } from 'react';
import { NitroCardSimpleHeaderViewProps } from './NitroCardSimpleHeaderView.types';

export const NitroCardSimpleHeaderView: FC<NitroCardSimpleHeaderViewProps> = props =>
{
    const { headerText = null, onCloseClick = null } = props;

    return (
        <div className="d-flex align-items-center bg-light">
            <div className="col-1"></div>
            <div className="d-flex bg-primary-split flex-grow-1 justify-content-center align-items-center border border-top-0 rounded-bottom px-2 py-1">
                <div className="h5 m-0 text-white text-shadow">{ headerText }</div>
            </div>
            <div className="d-flex col-1 justify-content-center align-items-center">
                <i className="fas fa-times cursor-pointer" onClick={ onCloseClick }></i>
            </div>
        </div>
    );
}
