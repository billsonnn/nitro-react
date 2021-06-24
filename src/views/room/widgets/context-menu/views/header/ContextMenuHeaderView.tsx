import { FC } from 'react';
import { ContextMenuHeaderViewProps } from './ContextMenuHeaderView.types';

export const ContextMenuHeaderView: FC<ContextMenuHeaderViewProps> = props =>
{
    const { children = null } = props;

    return (
        <div>
            { children }
        </div>
    );
}
