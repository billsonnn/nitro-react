import { FC } from 'react';
import { ContextMenuListItemViewProps } from './ContextMenuListItemView.types';

export const ContextMenuListItemView: FC<ContextMenuListItemViewProps> = props =>
{
    const { onClick = null, children = null } = props;

    return (
        <div className="col menu-list-item-container" onClick={ onClick }>
            <div className="d-flex justify-content-center align-items-center menu-list-item">
                { children }
            </div>
        </div>
    )
}
