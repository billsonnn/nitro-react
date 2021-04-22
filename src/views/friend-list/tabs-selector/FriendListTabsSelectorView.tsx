import { FC } from 'react';
import { FriendListTabsSelectorViewProps } from './FriendListTabsSelectorView.types';
import { FriendListTabView } from './tab/FriendListTabView';

export const FriendListTabsSelectorView: FC<FriendListTabsSelectorViewProps> = props =>
{
    return (
        <div className="p-3">
            { props.tabs &&
                <div className="btn-group w-100">
                    { props.tabs.map((tab, index) =>
                        {
                            return <FriendListTabView key={ index } tab={ tab } />
                        }) }
                </div> }
        </div>
    );
}
