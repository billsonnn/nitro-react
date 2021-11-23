import { RelationshipStatusInfoEvent, RelationshipStatusInfoMessageParser, RoomSessionUserBadgesEvent, UserRelationshipsComposer } from '@nitrots/nitro-renderer';
import classNames from 'classnames';
import { FC, FocusEvent, KeyboardEvent, useCallback, useEffect, useState } from 'react';
import { GetGroupInformation, LocalizeText, RoomWidgetChangeMottoMessage, RoomWidgetUpdateInfostandUserEvent } from '../../../../../../api';
import { CreateMessageHook, SendMessageHook } from '../../../../../../hooks';
import { CreateEventDispatcherHook } from '../../../../../../hooks/events';
import { NitroLayoutFlex, UserProfileIconView } from '../../../../../../layout';
import { AvatarImageView } from '../../../../../shared/avatar-image/AvatarImageView';
import { BadgeImageView } from '../../../../../shared/badge-image/BadgeImageView';
import { RelationshipsContainerView } from '../../../../../user-profile/views/relationships-container/RelationshipsContainerView';
import { useRoomContext } from '../../../../context/RoomContext';
import { InfoStandWidgetUserViewProps } from './InfoStandWidgetUserView.types';

export const InfoStandWidgetUserView: FC<InfoStandWidgetUserViewProps> = props =>
{
    const { userData = null, close = null } = props;
    const { eventDispatcher = null, widgetHandler = null } = useRoomContext();
    const [ badges, setBadges ] = useState<string[]>([]);
    const [ motto, setMotto ] = useState(null);
    const [ isEditingMotto, setIsEditingMotto ] = useState(false);
    const [ userRelationships, setUserRelationships ] = useState<RelationshipStatusInfoMessageParser>(null);

    const saveMotto = useCallback((motto: string) =>
    {
        if(motto.length > 38) return;

        widgetHandler.processWidgetMessage(new RoomWidgetChangeMottoMessage(motto));

        setIsEditingMotto(false);
    }, [ widgetHandler ]);

    const onMottoBlur = useCallback((event: FocusEvent<HTMLInputElement>) =>
    {
        saveMotto(event.target.value);
    }, [ saveMotto ]);

    const onMottoKeyDown = useCallback((event: KeyboardEvent<HTMLInputElement>) =>
    {
        event.stopPropagation();
        
        switch(event.key)
        {
            case 'Enter':
                saveMotto((event.target as HTMLInputElement).value);
                return;
        }
    }, [ saveMotto ]);

    const onRoomSessionUserBadgesEvent = useCallback((event: RoomSessionUserBadgesEvent) =>
    {
        if(!userData || (userData.webID !== event.userId)) return;

        setBadges(event.badges);
    }, [ userData ]);

    CreateEventDispatcherHook(RoomSessionUserBadgesEvent.RSUBE_BADGES, eventDispatcher, onRoomSessionUserBadgesEvent);

    const onUserRelationshipsEvent = useCallback((event: RelationshipStatusInfoEvent) =>
    {
        const parser = event.getParser();

        if(userData && userData.webID === parser.userId)
            setUserRelationships(parser);
    }, [userData]);

    CreateMessageHook(RelationshipStatusInfoEvent, onUserRelationshipsEvent);

    useEffect(() =>
    {
        setBadges(userData.badges);
        setIsEditingMotto(false);
        setMotto(userData.motto);
        SendMessageHook(new UserRelationshipsComposer(userData.webID));

        return () => 
        {
            setBadges([]);
            setUserRelationships(null);
        }
    }, [ userData ]);

    if(!userData) return null;

    return (
        <div className="d-flex flex-column nitro-card nitro-infostand rounded">
            <div className="container-fluid content-area overflow-visible">
                <div className="d-flex justify-content-between align-items-center">
                    <NitroLayoutFlex className="align-items-center">
                        <UserProfileIconView userId={ userData.webID } />
                        <span className="small text-wrap">{ userData.name }</span>
                    </NitroLayoutFlex>
                    <i className="fas fa-times cursor-pointer" onClick={ close }></i>
                </div>
                <hr className="m-0 my-1" />
                <div className="d-flex">
                    <div className="body-image w-100">
                        <AvatarImageView figure={ userData.figure } direction={ 4 } />
                    </div>
                    <div>
                        <div className="d-flex justify-content-between">
                            <div className="badge-image">
                                { badges[0] && <BadgeImageView badgeCode={ badges[0] } showInfo={ true } /> }
                            </div>
                            <div className={ 'badge-image' + classNames({ ' cursor-pointer': userData.groupId > 0 }) } onClick={ () => GetGroupInformation(userData.groupId) }>
                                { userData.groupId > 0 && <BadgeImageView badgeCode={ userData.groupBadgeId } isGroup={ true } showInfo={ true } customTitle={ userData.groupName } /> }
                            </div>
                        </div>
                        <div className="d-flex justify-content-between">
                            <div className="badge-image">
                                { badges[1] && <BadgeImageView badgeCode={ badges[1] } showInfo={ true } /> }
                            </div>
                            <div className="badge-image">
                                { badges[2] && <BadgeImageView badgeCode={ badges[2] } showInfo={ true } /> }
                            </div>
                        </div>
                        <div className="d-flex justify-content-between">
                            <div className="badge-image">
                                { badges[3] && <BadgeImageView badgeCode={ badges[3] } showInfo={ true } /> }
                            </div>
                            <div className="badge-image">
                                { badges[4] && <BadgeImageView badgeCode={ badges[4] } showInfo={ true } /> }
                            </div>
                        </div>
                    </div>
                </div>
                <hr className="m-0 my-1" />
                <div className="bg-light-dark rounded py-1 px-2 small">
                    { userData.type !== RoomWidgetUpdateInfostandUserEvent.OWN_USER && <div className="motto-content w-100 text-wrap text-break">{ motto }</div> }
                    { userData.type === RoomWidgetUpdateInfostandUserEvent.OWN_USER &&
                        <div className="d-flex justify-content-between align-items-center">
                            <i className="small fas fa-pencil-alt me-2"></i>
                            <div className="h-100 w-100">
                                { !isEditingMotto &&
                                    <div className="motto-content cursor-pointer w-100 text-wrap text-break" onClick={ event => setIsEditingMotto(true) }>{ motto }</div> }
                                { isEditingMotto &&
                                    <input type="text" className="motto-input" maxLength={ 38 } value={ motto } onChange={ event => setMotto(event.target.value) } onBlur={ onMottoBlur } onKeyDown={ onMottoKeyDown } autoFocus={ true } /> }
                            </div>
                        </div> }
                </div>
                <hr className="m-0 my-1" />
                <div className="small text-wrap">
                    { LocalizeText('infostand.text.achievement_score') + ' ' + userData.achievementScore }
                </div>
                { (userData.carryItem > 0) &&
                    <>
                        <hr className="m-0 my-1" />
                        <div className="small text-wrap">
                            { LocalizeText('infostand.text.handitem', [ 'item' ], [ LocalizeText('handitem' + userData.carryItem) ]) }
                        </div>
                    </> 
                }
                <RelationshipsContainerView relationships={userRelationships} simple={true}/>
            </div>
        </div>);
}
