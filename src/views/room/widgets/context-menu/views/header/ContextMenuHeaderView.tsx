import { FC } from 'react';
import { ContextMenuHeaderViewProps } from './ContextMenuHeaderView.types';

export const ContextMenuHeaderView: FC<ContextMenuHeaderViewProps> = props =>
{
    const { className = null, onClick = null, children = null } = props;

    return (
        <div className={ 'd-flex justify-content-center align-items-center menu-header p-1' + (className ? ' ' + className : '') } onClick={ onClick }>
            { children }
        </div>
    );
}
