import { GroupAdminGiveComposer, GroupAdminTakeComposer, GroupConfirmMemberRemoveEvent, GroupConfirmRemoveMemberComposer, GroupMemberParser, GroupMembersComposer, GroupMembersEvent, GroupMembershipAcceptComposer, GroupMembershipDeclineComposer, GroupMembersParser, GroupRank, GroupRemoveMemberComposer } from '@nitrots/nitro-renderer';
import classNames from 'classnames';
import { FC, KeyboardEvent, useCallback, useEffect, useState } from 'react';
import { GetSessionDataManager, GetUserProfile, LocalizeText } from '../../../../api';
import { CreateMessageHook, SendMessageHook } from '../../../../hooks';
import { NitroCardContentView, NitroCardHeaderView, NitroCardView } from '../../../../layout';
import { AvatarImageView } from '../../../../views/shared/avatar-image/AvatarImageView';
import { BadgeImageView } from '../../../../views/shared/badge-image/BadgeImageView';

interface GroupMembersViewProps
{
    groupId: number;
    levelId: number;
    onClose: () => void;
}


export const GroupMembersView: FC<GroupMembersViewProps> = props =>
{
    const { groupId = null, levelId = null, onClose = null } = props;

    const [ pageData, setPageData ] = useState<GroupMembersParser>(null);
    const [ searchQuery, setSearchQuery ] = useState<string>('');
    const [ searchLevelId, setSearchLevelId ] = useState<number>(3);
    const [ totalPages, setTotalPages ] = useState<number>(0);
    const [ removingMemberName, setRemovingMemberName ] = useState<string>(null);

    const searchMembers = useCallback((pageId: number, newLevelId?: number) =>
    {
        if(!groupId) return;
        
        SendMessageHook(new GroupMembersComposer(groupId, pageId, searchQuery, newLevelId !== undefined ? newLevelId : searchLevelId));
    }, [ groupId, searchQuery, searchLevelId ]);

    const onGroupMembersEvent = useCallback((event: GroupMembersEvent) =>
    {
        const parser = event.getParser();
        
        setPageData(null);
        setPageData(parser);
        setSearchLevelId(parser.level);
        setTotalPages(Math.ceil(parser.totalMembersCount / parser.pageSize));
    }, []);

    const onGroupConfirmMemberRemoveEvent = useCallback((event: GroupConfirmMemberRemoveEvent) =>
    {
        const parser = event.getParser();

        if(window.confirm(LocalizeText(parser.furnitureCount > 0 ? 'group.kickconfirm.desc' : 'group.kickconfirm_nofurni.desc', ['user', 'amount'], [removingMemberName, parser.furnitureCount.toString()])))
        {
            SendMessageHook(new GroupRemoveMemberComposer(pageData.groupId, parser.userId));
            searchMembers(pageData.pageIndex);
        }

        setRemovingMemberName(null);
    }, [ pageData, removingMemberName, searchMembers ]);

    CreateMessageHook(GroupMembersEvent, onGroupMembersEvent);
    CreateMessageHook(GroupConfirmMemberRemoveEvent, onGroupConfirmMemberRemoveEvent);

    useEffect(() =>
    {
        setPageData(null);
        setSearchQuery('');
        setSearchLevelId(0);

        if(!groupId) return;

        if(levelId !== null) setSearchLevelId(levelId);

        searchMembers(0, levelId);
    }, [ groupId, levelId ]);

    const selectSearchLevelId = useCallback((level: number) =>
    {
        setSearchLevelId(level);
        searchMembers(0, level);
    }, [ searchMembers ]);

    const previousPage = useCallback(() =>
    {
        searchMembers(pageData.pageIndex - 1);
    }, [ searchMembers, pageData ]);

    const nextPage = useCallback(() =>
    {
        searchMembers(pageData.pageIndex + 1);
    }, [ searchMembers, pageData ]);

    const onKeyDown = useCallback((event: KeyboardEvent<HTMLInputElement>) =>
    {
        if(event.key !== 'Enter') return;

        searchMembers(pageData.pageIndex);
    }, [ searchMembers, pageData ]);

    const getRankDescription = useCallback((member: GroupMemberParser) =>
    {
        if(member.rank === GroupRank.OWNER) return 'group.members.owner';
        
        if(pageData.admin)
        {
            if(member.rank === GroupRank.ADMIN) return 'group.members.removerights';

            if(member.rank === GroupRank.MEMBER) return 'group.members.giverights';
        }

        return '';
    }, [ pageData ]);

    const toggleAdmin = useCallback((member: GroupMemberParser) =>
    {
        if(member.rank === GroupRank.OWNER) return;
        
        if(member.rank !== GroupRank.ADMIN)
        {
            SendMessageHook(new GroupAdminGiveComposer(pageData.groupId, member.id));
        }
        else
        {
            SendMessageHook(new GroupAdminTakeComposer(pageData.groupId, member.id));
        }

        searchMembers(pageData.pageIndex);
    }, [ pageData, searchMembers ]);

    const acceptMembership = useCallback((member) =>
    {
        if(member.rank === GroupRank.REQUESTED)
        {
            SendMessageHook(new GroupMembershipAcceptComposer(pageData.groupId, member.id));
            searchMembers(pageData.pageIndex);
        }
    }, [ pageData, searchMembers ]);

    const removeMemberOrDeclineMembership = useCallback((member) =>
    {
        if(member.rank === GroupRank.REQUESTED)
        {
            SendMessageHook(new GroupMembershipDeclineComposer(pageData.groupId, member.id));
            searchMembers(pageData.pageIndex);
        }
        else
        {
            setRemovingMemberName(member.name);
            SendMessageHook(new GroupConfirmRemoveMemberComposer(pageData.groupId, member.id));
        }
    }, [ pageData, searchMembers ]);

    if(!groupId) return null;

    return (
        <NitroCardView className="nitro-group-members" simple={ true }>
            <NitroCardHeaderView headerText={ LocalizeText('group.members.title', ['groupName'], [ pageData ? pageData.groupTitle : '' ]) } onCloseClick={ onClose } />
            { pageData && <>
                <NitroCardContentView className="pb-2">
                    <div className="d-flex gap-2 align-items-center mb-2">
                        <div className="group-badge">
                            <BadgeImageView badgeCode={ pageData.badge } isGroup={ true } />
                        </div>
                        <div className="w-100">
                            <input type="text" className="form-control form-control-sm w-100 mb-1" placeholder={ LocalizeText('group.members.searchinfo') } value={ searchQuery } onChange={ (e) => setSearchQuery(e.target.value) } onBlur={ () => searchMembers(pageData.pageIndex) } onKeyDown={ onKeyDown } />
                            <select className="form-select form-select-sm w-100" value={ searchLevelId } onChange={ (e) => selectSearchLevelId(Number(e.target.value)) }>
                                <option value="0">{ LocalizeText('group.members.search.all') }</option>
                                <option value="1">{ LocalizeText('group.members.search.admins') }</option>
                                <option value="2">{ LocalizeText('group.members.search.pending') }</option>
                            </select>
                        </div>
                    </div>
                    <div className="row row-cols-2 align-content-start g-0 w-100 members-list overflow-auto">
                        { pageData.result.map((member, index) =>
                        {
                            return (
                                <div key={ index } className={ 'col pb-1' + classNames({ ' pe-1': index % 2 === 0 }) }>
                                    <div className="list-member bg-white rounded d-flex text-black">
                                        <div className="avatar-head flex-shrink-0 cursor-pointer" onClick={ () => { GetUserProfile(member.id) } }>
                                            <AvatarImageView figure={ member.figure } headOnly={ true } direction={ 2 } />
                                        </div>
                                        <div className="p-1 w-100 d-flex flex-column justify-content-center">
                                            <div className="fw-bold small cursor-pointer" onClick={ () => { GetUserProfile(member.id) } }>{ member.name }</div>
                                            { member.rank !== GroupRank.REQUESTED && <div className="text-muted fst-italic small">{ LocalizeText('group.members.since', ['date'], [member.joinedAt]) }</div> }
                                        </div>
                                        <div className="d-flex flex-column pe-2 align-items-center justify-content-center">
                                            <div className="d-flex align-items-center">
                                                <i className={ 'icon icon-group-small-' + classNames({ 'owner': member.rank === GroupRank.OWNER, 'admin': member.rank === GroupRank.ADMIN, 'not-admin': member.rank === GroupRank.MEMBER, 'cursor-pointer': pageData.admin }) } title={ LocalizeText(getRankDescription(member)) } onClick={ () => toggleAdmin(member) } />
                                            </div>
                                            { member.rank === GroupRank.REQUESTED && <div className="d-flex align-items-center">
                                                <i className="icon cursor-pointer icon-accept" title={ LocalizeText('group.members.accept') } onClick={ () => acceptMembership(member) } />
                                            </div> }
                                            { member.rank !== GroupRank.OWNER && pageData.admin && member.id !== GetSessionDataManager().userId &&<div className="d-flex align-items-center mt-1">
                                                <i className="icon cursor-pointer icon-deny" title={ LocalizeText(member.rank === GroupRank.REQUESTED ? 'group.members.reject' : 'group.members.kick') } onClick={ () => removeMemberOrDeclineMembership(member) } />
                                            </div> }
                                        </div>
                                    </div>
                                </div>
                            );
                        }) }
                    </div>
                    <div className="d-flex w-100 align-items-center">
                        <div>
                            <button disabled={ pageData.pageIndex === 0 } className="btn btn-primary" onClick={ previousPage }><i className="fas fa-chevron-left" /></button>
                        </div>
                        <div className="text-center text-black w-100">{ LocalizeText('group.members.pageinfo', ['amount', 'page', 'totalPages'], [pageData.totalMembersCount.toString(), (pageData.pageIndex + 1).toString(), totalPages.toString()]) }</div>
                        <div>
                            <button disabled={ pageData.pageIndex === totalPages - 1 } className="btn btn-primary" onClick={ nextPage }><i className="fas fa-chevron-right" /></button>
                        </div>
                    </div>
                </NitroCardContentView>
            </> }
        </NitroCardView>
    );
};
