import { DesktopViewEvent, GroupInformationComposer, GroupInformationEvent, GroupInformationParser, GroupJoinComposer, GroupRemoveMemberComposer, RoomInfoEvent } from '@nitrots/nitro-renderer';
import { FC, useCallback, useState } from 'react';
import { GetGroupInformation, GetSessionDataManager, LocalizeText } from '../../../../api';
import { CreateMessageHook, SendMessageHook } from '../../../../hooks';
import { BadgeImageView } from '../../../shared/badge-image/BadgeImageView';
import { GroupMembershipType } from '../../common/GroupMembershipType';
import { GroupType } from '../../common/GroupType';

export const GroupRoomInformationView: FC<{}> = props =>
{
    const [ groupId, setGroupId ] = useState<number>(null);
    const [ groupInformation, setGroupInformation ] = useState<GroupInformationParser>(null);
    const [ isExpended, setIsExpended ] = useState<boolean>(true);
    
    const onRoomInfoEvent = useCallback((event: RoomInfoEvent) =>
    {
        const parser = event.getParser();
        
        setGroupInformation(null);
        
        if(parser.data.habboGroupId)
        {
            setGroupId(parser.data.habboGroupId);
            SendMessageHook(new GroupInformationComposer(parser.data.habboGroupId, false));
        }
    }, []);

    CreateMessageHook(RoomInfoEvent, onRoomInfoEvent);

    const onGroupInformationEvent = useCallback((event: GroupInformationEvent) =>
    {
        const parser = event.getParser();

        if(parser.flag || groupId !== parser.id) return;

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
        SendMessageHook(new GroupRemoveMemberComposer(groupInformation.id, GetSessionDataManager().userId));
        SendMessageHook(new GroupInformationComposer(groupInformation.id, false));
    }, [ groupInformation ]);

    const getButtonText = useCallback(() =>
    {
        if(groupInformation.type === GroupType.PRIVATE) return '';

        if(isRealOwner()) return 'group.youareowner';

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
        if(groupInformation.type === GroupType.PRIVATE && groupInformation.membershipType === GroupMembershipType.NOT_MEMBER) return;

        if(groupInformation.membershipType === GroupMembershipType.MEMBER) return tryLeaveGroup();

        return tryJoinGroup();
    }, [ groupInformation, tryLeaveGroup, tryJoinGroup ]);

    if(!groupInformation) return null;

    return (
        <div className="nitro-group-room-information rounded py-1 px-2">
            <div className="d-flex justify-content-between align-items-center cursor-pointer" onClick={ () => setIsExpended(value => !value) }>
                <div>{ LocalizeText('group.homeroominfo.title') }</div>
                <i className={ 'fas fa-chevron-' + (isExpended ? 'up' : 'down') } />
            </div>
            { isExpended && <>
                <div className="d-flex cursor-pointer" onClick={ () => GetGroupInformation(groupInformation.id) }>
                    <div className="group-badge flex-shrink-0 me-1">
                        <BadgeImageView badgeCode={ groupInformation.badge } isGroup={ true } />
                    </div>
                    <div>
                        { groupInformation.title }
                    </div>
                </div>
                { groupInformation.type !== GroupType.PRIVATE && !isRealOwner() && 
                        <button className="btn btn-sm btn-primary w-100 mt-1" disabled={ groupInformation.membershipType === GroupMembershipType.REQUEST_PENDING || isRealOwner() } onClick={ handleButtonClick }>
                            { LocalizeText(getButtonText()) }
                        </button>
                    }
            </> }
        </div>
    );
};
