import { FC, MouseEvent, useCallback } from 'react';
import { useNitroCardContext } from '../context/NitroCardContext';
import { NitroCardHeaderViewProps } from './NitroCardHeaderView.types';

export const NitroCardHeaderView: FC<NitroCardHeaderViewProps> = props =>
{
    const { headerText = null, onCloseClick = null, theme = 'primary' } = props;
    const { simple = false } = useNitroCardContext();

    const onMouseDown = useCallback((event: MouseEvent<HTMLDivElement>) =>
    {
        event.stopPropagation();
        event.nativeEvent.stopImmediatePropagation();
    }, []);

    if(simple)
    {
        return (
            <div className="drag-handler container-fluid nitro-card-header-container bg-tertiary-split">
                <div className="row nitro-card-header overflow-hidden">
                    <div className="d-flex justify-content-center align-items-center w-100 position-relative">
                        <div className="h5 text-shadow header-text">{ headerText }</div>
                        <div className="position-absolute header-close" onMouseDownCapture={ onMouseDown } onClick={ onCloseClick }>
                            <i className="fas fa-times" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="drag-handler container-fluid nitro-card-header-container">
            <div className="row nitro-card-header overflow-hidden">
                <div className="d-flex justify-content-center align-items-center w-100 position-relative">
                    <div className="h4 text-shadow header-text">{ headerText }</div>
                    <div className="position-absolute header-close" onMouseDownCapture={ onMouseDown } onClick={ onCloseClick }>
                        <i className="fas fa-times" />
                    </div>
                </div>
            </div>
        </div>
    );
}
