import { FC, MouseEvent, useCallback } from 'react';
import { ContextMenuListItemViewProps } from './ContextMenuListItemView.types';

export const ContextMenuListItemView: FC<ContextMenuListItemViewProps> = props =>
{
    const { className = '', canSelect = true, onClick = null, children = null } = props;

    const handleClick = useCallback((event: MouseEvent<HTMLDivElement>) =>
    {
        if(!canSelect) return;

        onClick(event);
    }, [ canSelect, onClick ]);

    return (
        <div className={ `d-flex justify-content-center align-items-center w-100 menu-list-item ${ !canSelect ? 'disabled ' : '' }${ className }` } onClick={ handleClick }>
            { children }
        </div>
    )
}
