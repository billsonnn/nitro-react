import { FC } from 'react';
import { ContextMenuListViewProps } from './ContextMenuListView.types';

export const ContextMenuListView: FC<ContextMenuListViewProps> = props =>
{
    const { columns = 1, children = null } = props;

    return (
        <div className={ 'd-flex flex-column menu-list' }>
            { children }
        </div>
    );
}
