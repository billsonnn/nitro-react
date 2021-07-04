import { FC } from 'react';
import { DraggableWindow } from '../../../../../../layout';
import { ObjectLocationView } from '../../../object-location/ObjectLocationView';
import { AvatarInfoRentableBotChatViewProps } from './AvatarInfoRentableBotChatView.types';

export const AvatarInfoRentableBotChatView: FC<AvatarInfoRentableBotChatViewProps> = props =>
{
    const { chatEvent = null } = props;

    return (
        <DraggableWindow noCenter={ true } handle=".drag-handler">
            <ObjectLocationView objectId={ chatEvent.objectId } category={ chatEvent.category } noFollow={ true }>
                <div className="nitro-context-menu">
                    <div className="drag-handler">test!!!!!</div>
                </div>
                </ObjectLocationView>
        </DraggableWindow>
    );
}
