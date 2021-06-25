import { FC } from 'react';
import { ContextMenuListViewProps } from './ContextMenuListView.types';

export const ContextMenuListView: FC<ContextMenuListViewProps> = props =>
{
    const { columns = 1, children = null } = props;

    return (
        <div className={ `row row-cols-${ columns } menu-list g-1` }>
            { children }
        </div>
    );
}
