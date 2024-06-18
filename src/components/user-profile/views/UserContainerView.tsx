import { GetSessionDataManager, RequestFriendComposer, UserProfileParser } from '@nitrots/nitro-renderer';
import { FC, useEffect, useState } from 'react';
import { FriendlyTime, LocalizeText, SendMessageComposer } from '../../../api';
import { LayoutAvatarImageView, Text } from '../../../common';

interface UserContainerViewProps
{
    userProfile: UserProfileParser;
}

export const UserContainerView: FC<UserContainerViewProps> = props =>
{
    const { userProfile = null } = props;
    const [ requestSent, setRequestSent ] = useState(userProfile.requestSent);
    const isOwnProfile = (userProfile.id === GetSessionDataManager().userId);
    const canSendFriendRequest = !requestSent && (!isOwnProfile && !userProfile.isMyFriend && !userProfile.requestSent);

    const addFriend = () =>
    {
        setRequestSent(true);

        SendMessageComposer(new RequestFriendComposer(userProfile.username));
    };

    useEffect(() =>
    {
        setRequestSent(userProfile.requestSent);
    }, [ userProfile ]);

    return (
        <div className="flex gap-2">
            <div className="flex flex-col justify-center items-center w-[75px] h-[120px]">
                <LayoutAvatarImageView direction={ 2 } figure={ userProfile.figure } />
            </div>
            <div className="flex flex-col gap-2">
                <div className="flex flex-col gap-0">
                    <Text bold>{ userProfile.username }</Text>
                    <Text italics small textBreak>{ userProfile.motto }&nbsp;</Text>
                </div>
                <div className="flex flex-col gap-1">
                    <Text small>
                        <b>{ LocalizeText('extendedprofile.created') }</b> { userProfile.registration }
                    </Text>
                    <Text small>
                        <b>{ LocalizeText('extendedprofile.last.login') }</b> { FriendlyTime.format(userProfile.secondsSinceLastVisit, '.ago', 2) }
                    </Text>
                    <Text small>
                        <b>{ LocalizeText('extendedprofile.achievementscore') }</b> { userProfile.achievementPoints }
                    </Text>
                </div>
                <div className="flex gap-1">
                    { userProfile.isOnline &&
                        <i className="nitro-icon icon-pf-online" /> }
                    { !userProfile.isOnline &&
                        <i className="nitro-icon icon-pf-offline" /> }
                    <div className="flex items-center gap-1">
                        { canSendFriendRequest &&
                            <Text pointer small underline onClick={ addFriend }>{ LocalizeText('extendedprofile.addasafriend') }</Text> }
                        { !canSendFriendRequest &&
                            <>
                                <i className="nitro-icon icon-pf-tick" />
                                { isOwnProfile &&
                                    <Text>{ LocalizeText('extendedprofile.me') }</Text> }
                                { userProfile.isMyFriend &&
                                    <Text>{ LocalizeText('extendedprofile.friend') }</Text> }
                                { (requestSent || userProfile.requestSent) &&
                                    <Text>{ LocalizeText('extendedprofile.friendrequestsent') }</Text> }
                            </> }
                    </div>
                </div>
            </div>
        </div>
    );
};
