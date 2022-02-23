import { DesktopViewEvent, GetGuestRoomResultEvent, GroupInformationComposer, GroupInformationEvent, GroupInformationParser, GroupJoinComposer, GroupRemoveMemberComposer } from '@nitrots/nitro-renderer';
import { FC, useCallback, useState } from 'react';
import { GetGroupInformation, GetSessionDataManager, LocalizeText } from '../../../../api';
import { GetGroupManager } from '../../../../api/groups/GetGroupManager';
import { CreateMessageHook, SendMessageHook } from '../../../../hooks';
import { BadgeImageView } from '../../../../views/shared/badge-image/BadgeImageView';
import { GroupMembershipType } from '../../common/GroupMembershipType';
import { GroupType } from '../../common/GroupType';

export const GroupRoomInformationView: FC<{}> = props =>
{
    const [ groupId, setGroupId ] = useState<number>(null);
    const [ groupInformation, setGroupInformation ] = useState<GroupInformationParser>(null);
    const [ isExpended, setIsExpended ] = useState<boolean>(true);

    const onGetGuestRoomResultEvent = useCallback((event: GetGuestRoomResultEvent) =>
    {
        const parser = event.getParser();
        
        setGroupInformation(null);

        if(parser.data.habboGroupId)
        {
            setGroupId(parser.data.habboGroupId);
            SendMessageHook(new GroupInformationComposer(parser.data.habboGroupId, false));
        }
    }, []);

    CreateMessageHook(GetGuestRoomResultEvent, onGetGuestRoomResultEvent);

    const onGroupInformationEvent = useCallback((event: GroupInformationEvent) =>
    {
        const parser = event.getParser();

        if(parser.flag || groupId !== parser.id) return;
        console.log(parser);
        setGroupInformation(null);
        setGroupInformation(parser);
    }, [ groupId ]);

    CreateMessageHook(GroupInformationEvent, onGroupInformationEvent);

    const onDesktopViewEvent = useCallback((event: DesktopViewEvent) =>
    {
        setGroupId(0);
        setGroupInformation(null);
    }, []);

    CreateMessageHook(DesktopViewEvent, onDesktopViewEvent);

    const isRealOwner = useCallback(() =>
    {
        if(!groupInformation) return false;

        return (groupInformation.ownerName === GetSessionDataManager().userName);
    }, [ groupInformation ]);

    const tryJoinGroup = useCallback(() =>
    {
        if(!groupInformation) return;

        SendMessageHook(new GroupJoinComposer(groupInformation.id));
        SendMessageHook(new GroupInformationComposer(groupInformation.id, false));
    }, [ groupInformation ]);

    const tryLeaveGroup = useCallback(() =>
    {
        if(window.confirm(LocalizeText('group.leaveconfirm.desc')))
        {
            SendMessageHook(new GroupRemoveMemberComposer(groupInformation.id, GetSessionDataManager().userId));
            SendMessageHook(new GroupInformationComposer(groupInformation.id, false));
        }
    }, [ groupInformation ]);

    const getButtonText = useCallback(() =>
    {
        if(isRealOwner()) return 'group.manage';

        if(groupInformation.type === GroupType.PRIVATE) return '';        

        if(groupInformation.membershipType === GroupMembershipType.MEMBER) return 'group.leave';

        if(groupInformation.membershipType === GroupMembershipType.NOT_MEMBER && groupInformation.type === GroupType.REGULAR) return 'group.join';

        if(groupInformation.type === GroupType.EXCLUSIVE)
        {
            if(groupInformation.membershipType === GroupMembershipType.NOT_MEMBER) return 'group.requestmembership';

            if(groupInformation.membershipType === GroupMembershipType.REQUEST_PENDING) return 'group.membershippending';
        }
    }, [ groupInformation, isRealOwner ]);

    const handleButtonClick = useCallback(() =>
    {
        if(isRealOwner()) return GetGroupManager(groupInformation.id);

        if(groupInformation.type === GroupType.PRIVATE && groupInformation.membershipType === GroupMembershipType.NOT_MEMBER) return;

        if(groupInformation.membershipType === GroupMembershipType.MEMBER) return tryLeaveGroup();

        return tryJoinGroup();
    }, [ groupInformation, tryLeaveGroup, tryJoinGroup, isRealOwner ]);

    if(!groupInformation) return null;

    return (
        <div className="nitro-group-room-information rounded">
            <div className="d-flex justify-content-between align-items-center cursor-pointer" onClick={ () => setIsExpended(value => !value) }>
                <div>{ LocalizeText('group.homeroominfo.title') }</div>
                <i className={ 'fas fa-chevron-' + (isExpended ? 'up' : 'down') } />
            </div>
            { isExpended && <>
                <div className="d-flex cursor-pointer" onClick={ () => GetGroupInformation(groupId) }>
                    <div className="group-badge flex-shrink-0 me-1">
                        <BadgeImageView badgeCode={ groupInformation.badge } isGroup={ true } />
                    </div>
                    <div>
                        { groupInformation.title }
                    </div>
                </div>
                { (groupInformation.type !== GroupType.PRIVATE || isRealOwner()) && 
                        <button className="btn btn-sm btn-success w-100 mt-1" disabled={ groupInformation.membershipType === GroupMembershipType.REQUEST_PENDING } onClick={ handleButtonClick }>
                            { LocalizeText(getButtonText()) }
                        </button>
                    }
            </> }
        </div>
    );
};
