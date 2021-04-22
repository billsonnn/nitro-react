import classNames from 'classnames';
import { FC, useContext } from 'react';
import { LocalizeText } from '../../../../utils/LocalizeText';
import { FriendListContext } from '../../FriendListView';
import { FriendListTabViewProps } from './FriendListTabView.types';

export const FriendListTabView: FC<FriendListTabViewProps> = props =>
{
    const friendListContext = useContext(FriendListContext);

    return (
        <button type="button" 
        className={ 'btn btn-secondary btn-sm ' + classNames({ 'active': friendListContext.currentTab === props.tab })}
        onClick={ () => friendListContext.onSetCurrentTab(props.tab) }>
            { LocalizeText(props.tab) }
        </button>
    );
}
