import { GetSessionDataManager, RelationshipStatusInfoEvent, RelationshipStatusInfoMessageParser, RoomSessionFavoriteGroupUpdateEvent, RoomSessionUserBadgesEvent, RoomSessionUserFigureUpdateEvent, UserRelationshipsComposer } from '@nitrots/nitro-renderer';
import { Dispatch, FC, FocusEvent, KeyboardEvent, SetStateAction, useEffect, useState } from 'react';
import { FaPencilAlt, FaTimes } from 'react-icons/fa';
import { AvatarInfoUser, CloneObject, GetConfigurationValue, GetGroupInformation, GetUserProfile, LocalizeText, SendMessageComposer } from '../../../../../api';
import { Column, Flex, LayoutAvatarImageView, LayoutBadgeImageView, Text, UserProfileIconView } from '../../../../../common';
import { useMessageEvent, useNitroEvent, useRoom } from '../../../../../hooks';
import { InfoStandWidgetUserRelationshipsView } from './InfoStandWidgetUserRelationshipsView';
import { InfoStandWidgetUserTagsView } from './InfoStandWidgetUserTagsView';

interface InfoStandWidgetUserViewProps
{
    avatarInfo: AvatarInfoUser;
    setAvatarInfo: Dispatch<SetStateAction<AvatarInfoUser>>;
    onClose: () => void;
}

export const InfoStandWidgetUserView: FC<InfoStandWidgetUserViewProps> = props =>
{
    const { avatarInfo = null, setAvatarInfo = null, onClose = null } = props;
    const [ motto, setMotto ] = useState<string>(null);
    const [ isEditingMotto, setIsEditingMotto ] = useState(false);
    const [ relationships, setRelationships ] = useState<RelationshipStatusInfoMessageParser>(null);
    const { roomSession = null } = useRoom();

    const saveMotto = (motto: string) =>
    {
        if(!isEditingMotto || (motto.length > GetConfigurationValue<number>('motto.max.length', 38))) return;

        roomSession.sendMottoMessage(motto);

        setIsEditingMotto(false);
    }

    const onMottoBlur = (event: FocusEvent<HTMLInputElement>) => saveMotto(event.target.value);

    const onMottoKeyDown = (event: KeyboardEvent<HTMLInputElement>) =>
    {
        event.stopPropagation();

        switch(event.key)
        {
            case 'Enter':
                saveMotto((event.target as HTMLInputElement).value);
                return;
        }
    }

    useNitroEvent<RoomSessionUserBadgesEvent>(RoomSessionUserBadgesEvent.RSUBE_BADGES, event =>
    {
        if(!avatarInfo || (avatarInfo.webID !== event.userId)) return;

        const oldBadges = avatarInfo.badges.join('');

        if(oldBadges === event.badges.join('')) return;

        setAvatarInfo(prevValue =>
        {
            const newValue = CloneObject(prevValue);

            newValue.badges = event.badges;

            return newValue;
        });
    });

    useNitroEvent<RoomSessionUserFigureUpdateEvent>(RoomSessionUserFigureUpdateEvent.USER_FIGURE, event =>
    {
        if(!avatarInfo || (avatarInfo.roomIndex !== event.roomIndex)) return;

        setAvatarInfo(prevValue =>
        {
            const newValue = CloneObject(prevValue);

            newValue.figure = event.figure;
            newValue.motto = event.customInfo;
            newValue.achievementScore = event.activityPoints;

            return newValue;
        });
    });

    useNitroEvent<RoomSessionFavoriteGroupUpdateEvent>(RoomSessionFavoriteGroupUpdateEvent.FAVOURITE_GROUP_UPDATE, event =>
    {
        if(!avatarInfo || (avatarInfo.roomIndex !== event.roomIndex)) return;

        setAvatarInfo(prevValue =>
        {
            const newValue = CloneObject(prevValue);
            const clearGroup = ((event.status === -1) || (event.habboGroupId <= 0));

            newValue.groupId = clearGroup ? -1 : event.habboGroupId;
            newValue.groupName = clearGroup ? null : event.habboGroupName
            newValue.groupBadgeId = clearGroup ? null : GetSessionDataManager().getGroupBadge(event.habboGroupId);

            return newValue;
        });
    });

    useMessageEvent<RelationshipStatusInfoEvent>(RelationshipStatusInfoEvent, event =>
    {
        const parser = event.getParser();

        if(!avatarInfo || (avatarInfo.webID !== parser.userId)) return;

        setRelationships(parser);
    });

    useEffect(() =>
    {
        setIsEditingMotto(false);
        setMotto(avatarInfo.motto);

        SendMessageComposer(new UserRelationshipsComposer(avatarInfo.webID));

        return () =>
        {
            setIsEditingMotto(false);
            setMotto(null);
            setRelationships(null);
        }
    }, [ avatarInfo ]);

    if(!avatarInfo) return null;

    return (
        <Column className="nitro-infostand rounded">
            <Column className="container-fluid content-area" gap={ 1 } overflow="visible">
                <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-content-between">
                        <div className="flex items-center gap-1">
                            <UserProfileIconView userId={ avatarInfo.webID } />
                            <Text small wrap variant="white">{ avatarInfo.name }</Text>
                        </div>
                        <FaTimes className="cursor-pointer fa-icon" onClick={ onClose } />
                    </div>
                    <hr className="m-0" />
                </div>
                <div className="flex flex-col gap-1">
                    <div className="flex gap-1">
                        <Column fullWidth className="body-image" onClick={ event => GetUserProfile(avatarInfo.webID) }>
                            <LayoutAvatarImageView direction={ 4 } figure={ avatarInfo.figure } />
                        </Column>
                        <Column grow alignItems="center" gap={ 0 }>
                            <div className="flex gap-1">
                                <div className="flex items-center justify-center badge-image">
                                    { avatarInfo.badges[0] && <LayoutBadgeImageView badgeCode={ avatarInfo.badges[0] } showInfo={ true } /> }
                                </div>
                                <Flex center className="badge-image" pointer={ ( avatarInfo.groupId > 0) } onClick={ event => GetGroupInformation(avatarInfo.groupId) }>
                                    { avatarInfo.groupId > 0 &&
                                        <LayoutBadgeImageView badgeCode={ avatarInfo.groupBadgeId } customTitle={ avatarInfo.groupName } isGroup={ true } showInfo={ true } /> }
                                </Flex>
                            </div>
                            <Flex center gap={ 1 }>
                                <div className="flex items-center justify-center badge-image">
                                    { avatarInfo.badges[1] && <LayoutBadgeImageView badgeCode={ avatarInfo.badges[1] } showInfo={ true } /> }
                                </div>
                                <div className="flex items-center justify-center badge-image">
                                    { avatarInfo.badges[2] && <LayoutBadgeImageView badgeCode={ avatarInfo.badges[2] } showInfo={ true } /> }
                                </div>
                            </Flex>
                            <Flex center gap={ 1 }>
                                <div className="flex items-center justify-center badge-image">
                                    { avatarInfo.badges[3] && <LayoutBadgeImageView badgeCode={ avatarInfo.badges[3] } showInfo={ true } /> }
                                </div>
                                <div className="flex items-center justify-center badge-image">
                                    { avatarInfo.badges[4] && <LayoutBadgeImageView badgeCode={ avatarInfo.badges[4] } showInfo={ true } /> }
                                </div>
                            </Flex>
                        </Column>
                    </div>
                    <hr className="m-0" />
                </div>
                <div className="flex flex-col gap-1">
                    <Flex alignItems="center" className="bg-light-dark rounded py-1 px-2">
                        { (avatarInfo.type !== AvatarInfoUser.OWN_USER) &&
                            <Flex grow alignItems="center" className="motto-content">
                                <Text fullWidth pointer small textBreak wrap variant="white">{ motto }</Text>
                            </Flex> }
                        { avatarInfo.type === AvatarInfoUser.OWN_USER &&
                            <Flex grow alignItems="center" gap={ 2 }>
                                <FaPencilAlt className="small fa-icon" />
                                <Flex grow alignItems="center" className="motto-content">
                                    { !isEditingMotto &&
                                        <Text fullWidth pointer small textBreak wrap variant="white" onClick={ event => setIsEditingMotto(true) }>{ motto }&nbsp;</Text> }
                                    { isEditingMotto &&
                                        <input autoFocus={ true } className="motto-input" maxLength={ GetConfigurationValue<number>('motto.max.length', 38) } type="text" value={ motto } onBlur={ onMottoBlur } onChange={ event => setMotto(event.target.value) } onKeyDown={ onMottoKeyDown } /> }
                                </Flex>
                            </Flex> }
                    </Flex>
                    <hr className="m-0" />
                </div>
                <div className="flex flex-col gap-1">
                    <Text small wrap variant="white">
                        { LocalizeText('infostand.text.achievement_score') + ' ' + avatarInfo.achievementScore }
                    </Text>
                    { (avatarInfo.carryItem > 0) &&
                        <>
                            <hr className="m-0" />
                            <Text small wrap variant="white">
                                { LocalizeText('infostand.text.handitem', [ 'item' ], [ LocalizeText('handitem' + avatarInfo.carryItem) ]) }
                            </Text>
                        </> }
                </div>
                <div className="flex flex-col gap-1">
                    <InfoStandWidgetUserRelationshipsView relationships={ relationships } />
                </div>
                { GetConfigurationValue('user.tags.enabled') &&
                    <Column className="mt-1" gap={ 1 }>
                        <InfoStandWidgetUserTagsView tags={ GetSessionDataManager().tags } />
                    </Column> }
            </Column>
        </Column>
    );
}
