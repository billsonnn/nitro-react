import classNames from 'classnames';
import { FC } from 'react';
import { ItemCountView } from '../../../../views/shared/item-count/ItemCountView';
import { NitroCardTabsItemViewProps } from './NitroCardTabsItemView.types';

export const NitroCardTabsItemView: FC<NitroCardTabsItemViewProps> = props =>
{
    const { children = null, isActive = false, count = 0, onClick = null } = props;

    return (
        <li className={ 'nav-link cursor-pointer position-relative' + classNames({ ' active': isActive }) } onClick={ onClick }>
            { children }
            { (count > 0) &&
                <ItemCountView count={ count } /> }
        </li>
    );
}
