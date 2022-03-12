import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { DesktopViewEvent, GetGuestRoomResultEvent, GroupInformationComposer, GroupInformationEvent, GroupInformationParser, GroupRemoveMemberComposer, HabboGroupDeactivatedMessageEvent, RoomEntryInfoMessageEvent } from '@nitrots/nitro-renderer';
import { FC, useCallback, useState } from 'react';
import { GetGroupInformation, GetGroupManager, GetSessionDataManager, LocalizeText, NotificationUtilities, SendMessageComposer, TryJoinGroup } from '../../../api';
import { Base, Button, Column, Flex, LayoutBadgeImageView, Text } from '../../../common';
import { UseMessageEventHook } from '../../../hooks';
import { GroupMembershipType } from '../common/GroupMembershipType';
import { GroupType } from '../common/GroupType';

export const GroupRoomInformationView: FC<{}> = props =>
{
    const [ expectedGroupId, setExpectedGroupId ] = useState<number>(0);
    const [ groupInformation, setGroupInformation ] = useState<GroupInformationParser>(null);
    const [ isOpen, setIsOpen ] = useState<boolean>(true);

    const onDesktopViewEvent = useCallback((event: DesktopViewEvent) =>
    {
        setExpectedGroupId(0);
        setGroupInformation(null);
    }, []);

    UseMessageEventHook(DesktopViewEvent, onDesktopViewEvent);

    const onRoomEntryInfoMessageEvent = useCallback((event: RoomEntryInfoMessageEvent) =>
    {
        setExpectedGroupId(0);
        setGroupInformation(null);
    }, []);

    UseMessageEventHook(RoomEntryInfoMessageEvent, onRoomEntryInfoMessageEvent);

    const onGetGuestRoomResultEvent = useCallback((event: GetGuestRoomResultEvent) =>
    {
        const parser = event.getParser();

        if(!parser.roomEnter) return;

        if(parser.data.habboGroupId > 0)
        {
            setExpectedGroupId(parser.data.habboGroupId);
            SendMessageComposer(new GroupInformationComposer(parser.data.habboGroupId, false));
        }
        else
        {
            setExpectedGroupId(0);
            setGroupInformation(null);
        }
    }, []);

    UseMessageEventHook(GetGuestRoomResultEvent, onGetGuestRoomResultEvent);

    const onHabboGroupDeactivatedMessageEvent = useCallback((event: HabboGroupDeactivatedMessageEvent) =>
    {
        const parser = event.getParser();

        if(!groupInformation || ((parser.groupId !== groupInformation.id) && (parser.groupId !== expectedGroupId))) return;

        setExpectedGroupId(0);
        setGroupInformation(null);
    }, [ expectedGroupId, groupInformation ]);

    UseMessageEventHook(HabboGroupDeactivatedMessageEvent, onHabboGroupDeactivatedMessageEvent);

    const onGroupInformationEvent = useCallback((event: GroupInformationEvent) =>
    {
        const parser = event.getParser();

        if(parser.id !== expectedGroupId) return;

        setGroupInformation(parser);
    }, [ expectedGroupId ]);

    UseMessageEventHook(GroupInformationEvent, onGroupInformationEvent);

    const leaveGroup = () =>
    {
        NotificationUtilities.confirm(LocalizeText('group.leaveconfirm.desc'), () =>
            {
                SendMessageComposer(new GroupRemoveMemberComposer(groupInformation.id, GetSessionDataManager().userId));
            }, null);
    }

    const isRealOwner = (groupInformation && (groupInformation.ownerName === GetSessionDataManager().userName));

    const getButtonText = () =>
    {
        if(isRealOwner) return 'group.manage';

        if(groupInformation.type === GroupType.PRIVATE) return '';

        if(groupInformation.membershipType === GroupMembershipType.MEMBER) return 'group.leave';

        if((groupInformation.membershipType === GroupMembershipType.NOT_MEMBER) && groupInformation.type === GroupType.REGULAR) return 'group.join';

        if(groupInformation.membershipType === GroupMembershipType.REQUEST_PENDING) return 'group.membershippending';

        if((groupInformation.membershipType === GroupMembershipType.NOT_MEMBER) && groupInformation.type === GroupType.EXCLUSIVE) return 'group.requestmembership';
    }

    const handleButtonClick = () =>
    {
        if(isRealOwner) return GetGroupManager(groupInformation.id);

        if((groupInformation.type === GroupType.PRIVATE) && (groupInformation.membershipType === GroupMembershipType.NOT_MEMBER)) return;

        if(groupInformation.membershipType === GroupMembershipType.MEMBER)
        {
            leaveGroup();

            return;
        }

        TryJoinGroup(groupInformation.id);
    }

    if(!groupInformation) return null;

    return (
        <Base className="nitro-notification-bubble rounded">
            <Column>
                <Flex alignItems="center" justifyContent="between" pointer onClick={ event => setIsOpen(value => !value) }>
                    <Text variant="white">{ LocalizeText('group.homeroominfo.title') }</Text>
                    <FontAwesomeIcon icon={ isOpen ? 'chevron-up' : 'chevron-down' } />
                </Flex>
                { isOpen &&
                    <>
                        <Flex pointer alignItems="center" gap={ 2 } onClick={ event => GetGroupInformation(groupInformation.id) }>
                            <Base className="group-badge">
                                <LayoutBadgeImageView badgeCode={ groupInformation.badge } isGroup={ true } />
                            </Base>
                            <Text variant="white">{ groupInformation.title }</Text>
                        </Flex>
                        { (groupInformation.type !== GroupType.PRIVATE || isRealOwner) && 
                            <Button fullWidth variant="success" disabled={ (groupInformation.membershipType === GroupMembershipType.REQUEST_PENDING) } onClick={ handleButtonClick }>
                                { LocalizeText(getButtonText()) }
                            </Button>
                            }
                    </> }
            </Column>
        </Base>
    );
};
