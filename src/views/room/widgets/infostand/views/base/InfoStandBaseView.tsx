import { FC } from 'react';
import { InfoStandBaseViewProps } from './InfoStandBaseView.types';

export const InfoStandBaseView: FC<InfoStandBaseViewProps> = props =>
{
    const { headerText = null, onCloseClick = null, children = null } = props;

    return (
        <div className="d-flex flex-column nitro-card nitro-infostand rounded">
            <div className="container-fluid content-area">
                <div className="d-flex justify-content-between align-items-center">
                    <div className="small text-wrap">{ headerText }</div>
                    <i className="fas fa-times cursor-pointer" onClick={ onCloseClick }></i>
                </div>
                <hr className="m-0 my-1" />
                { children }
            </div>
        </div>
    );
}
