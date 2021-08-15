import { FC } from 'react';
import { LocalizeText } from '../../utils/LocalizeText';
import { DraggableWindow } from '../draggable-window';
import { NitroLayoutTrophyViewProps } from './NitroLayoutTrophyView.types';

export const NitroLayoutTrophyView: FC<NitroLayoutTrophyViewProps> = props =>
{
    const { color = '', message = '', date = '', senderName = '', onCloseClick = null } = props;

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
