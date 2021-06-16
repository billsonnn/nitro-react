import { FC } from 'react';
import { useNitroCardContext } from '../context/NitroCardContext';
import { NitroCardHeaderViewProps } from './NitroCardHeaderView.types';

export const NitroCardHeaderView: FC<NitroCardHeaderViewProps> = props =>
{
    const { headerText = null, onCloseClick = null } = props;
    const { theme } = useNitroCardContext();

    return (
        <div className={ `drag-handler container-fluid bg-${ theme }` }>
            <div className="row nitro-card-header">
                <div className="col-10 offset-1 d-flex justify-content-center align-items-center">
                    <div className="h4 m-0 text-white text-shadow">{ headerText }</div>
                </div>
                <div className="d-flex col-1 justify-content-center align-items-center">
                    <div className="cursor-pointer" onClick={ onCloseClick }>
                        <i className="fas fa-times"></i>
                    </div>
                </div>
            </div>
        </div>
    );
}
