import classNames from 'classnames';
import { FC } from 'react';
import { NitroCardTabsItemViewProps } from './NitroCardTabsItemView.types';

export const NitroCardTabsItemView: FC<NitroCardTabsItemViewProps> = props =>
{
    const { children = null, isActive = false, count = 0, onClick = null } = props;

    return (
        <li className="nav-item me-1 cursor-pointer" onClick={ onClick }>
            <span className={ 'nav-link ' + classNames({ 'active': isActive }) }>
                { children }
                { (count > 0) &&
                    <span className="bg-danger ms-1 rounded count">{ count }</span> }
            </span>
        </li>
    );
}
