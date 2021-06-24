import { FC } from 'react';
import { ContextMenuListItemViewProps } from './ContextMenuListItemView.types';

export const ContextMenuListItemView: FC<ContextMenuListItemViewProps> = props =>
{
    const { onClick = null, children = null } = props;

    return (
        <div className="" onClick={ onClick }>
            { children }
        </div>
    )
}
