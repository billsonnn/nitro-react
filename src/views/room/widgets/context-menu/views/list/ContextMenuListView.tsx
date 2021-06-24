import { FC } from 'react';
import { ContextMenuListViewProps } from './ContextMenuListView.types';

export const ContextMenuListView: FC<ContextMenuListViewProps> = props =>
{
    const { children = null } = props;

    return (
        <div>
            { children }
        </div>
    );
}
