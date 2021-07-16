import { FC } from 'react';
import { useNitroCardContext } from '../context/NitroCardContext';
import { NitroCardHeaderViewProps } from './NitroCardHeaderView.types';

export const NitroCardHeaderView: FC<NitroCardHeaderViewProps> = props =>
{
    const { headerText = null, onCloseClick = null } = props;
    const { simple = false } = useNitroCardContext();

    if(simple)
    {
        return (
            <div className="container-fluid bg-light">
                <div className="row nitro-card-header simple-header">
                    <div className="d-flex justify-content-center align-items-center w-100 position-relative">
                        <div className="h5 text-white text-center text-shadow bg-tertiary-split border-top-0 rounded-bottom drag-handler">{ headerText }</div>
                        <div className="position-absolute header-close" onMouseDown={ event => event.stopPropagation() } onClick={ onCloseClick }>
                            <i className="fas fa-times" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="drag-handler container-fluid bg-primary">
            <div className="row nitro-card-header">
                <div className="d-flex justify-content-center align-items-center w-100 position-relative">
                    <div className="h4 text-white text-shadow header-text">{ headerText }</div>
                    <div className="position-absolute header-close" onMouseDown={ event => event.stopPropagation() } onClick={ onCloseClick }>
                        <i className="fas fa-times" />
                    </div>
                </div>
            </div>
        </div>
    );
}
