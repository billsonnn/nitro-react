import { FC, useCallback } from 'react';
import { ContextMenuView } from '../../../context-menu/ContextMenuView';
import { AvatarInfoWidgetNameViewProps } from './AvatarInfoWidgetNameView.types';

export const AvatarInfoWidgetNameView: FC<AvatarInfoWidgetNameViewProps> = props =>
{
    const { event = null } = props;

    const onClose = useCallback(() =>
    {

    }, []);

    return (
        <ContextMenuView objectId={ event.roomIndex } category={ event.category } onClose= { onClose }>
            <div className="d-flex justify-content-center align-items-center bg-dark border border-dark">
                { event.name }
            </div>
        </ContextMenuView>
    );
}
