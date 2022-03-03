import { FC } from 'react';
import { LocalizeText } from '../../api';
import { DraggableWindow } from '../draggable-window';

interface LayoutTrophyViewProps
{
    color: string;
    message: string;
    date: string;
    senderName: string;
    customTitle?: string;
    onCloseClick: () => void;
}

export const LayoutTrophyView: FC<LayoutTrophyViewProps> = props =>
{
    const { color = '', message = '', date = '', senderName = '', customTitle = null, onCloseClick = null } = props;

    return (
        <DraggableWindow handleSelector=".drag-handler">
            <div className={ `nitro-layout-trophy trophy-${ color }` }>
                <div className="trophy-header drag-handler">
                    <div className="float-end trophy-close" onClick={ onCloseClick }></div>
                    <div className="trophy-title fw-bold text-center">
                        { LocalizeText('widget.furni.trophy.title') }
                    </div>
                </div>
                <div className="trophy-content">
                    { customTitle && <div className="mb-2 fw-bold">{ customTitle }</div> }
                    { message }
                </div>
                <div className="trophy-footer d-flex justify-content-between fw-bold">
                    <div>{ date }</div>
                    <div>{ senderName }</div>
                </div>
            </div>
        </DraggableWindow>
    );
}
