import { FC } from 'react';
import { ContextMenuHeaderViewProps } from './ContextMenuHeaderView.types';

export const ContextMenuHeaderView: FC<ContextMenuHeaderViewProps> = props =>
{
    const { children = null } = props;

    return (
        <div className="d-flex justify-content-center align-items-center menu-header p-1">
            { children }
        </div>
    );
}
