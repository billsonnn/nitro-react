import classNames from 'classnames';
import { FC } from 'react';
import { NitroCardTabsItemViewProps } from './NitroCardTabsItemView.types';

export const NitroCardTabsItemView: FC<NitroCardTabsItemViewProps> = props =>
{
    const { children = null, isActive = false, onClick = null } = props;

    return (
        <li className="nav-item me-1 cursor-pointer" onClick={ onClick }>
            <span className={ 'nav-link ' + classNames({ 'active': isActive }) }>{ children }</span>
        </li>
    );
}
