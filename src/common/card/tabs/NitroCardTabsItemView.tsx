import classNames from 'classnames';
import { FC, MouseEventHandler } from 'react';
import { LayoutItemCountView } from '../../layout';

interface NitroCardTabsItemViewProps
{
    isActive?: boolean;
    count?: number;
    onClick?: MouseEventHandler<HTMLLIElement>;
}

export const NitroCardTabsItemView: FC<NitroCardTabsItemViewProps> = props =>
{
    const { children = null, isActive = false, count = 0, onClick = null } = props;

    return (
        <li className={ 'nav-link cursor-pointer position-relative' + classNames({ ' active': isActive }) } onClick={ onClick }>
            { children }
            { (count > 0) &&
                <LayoutItemCountView count={ count } /> }
        </li>
    );
}
