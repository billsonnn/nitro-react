import { RoomSessionUserBadgesEvent } from 'nitro-renderer';
import { FC, FocusEvent, KeyboardEvent, useCallback, useEffect, useState } from 'react';
import { CreateEventDispatcherHook } from '../../../../../../hooks/events';
import { LocalizeText } from '../../../../../../utils/LocalizeText';
import { AvatarImageView } from '../../../../../avatar-image/AvatarImageView';
import { BadgeImageView } from '../../../../../badge-image/BadgeImageView';
import { useRoomContext } from '../../../../context/RoomContext';
import { RoomWidgetUpdateInfostandUserEvent } from '../../../../events/RoomWidgetUpdateInfostandUserEvent';
import { RoomWidgetChangeMottoMessage } from '../../../../messages';
import { InfoStandWidgetUserViewProps } from './InfoStandWidgetUserView.types';

export const InfoStandWidgetUserView: FC<InfoStandWidgetUserViewProps> = props =>
{
    const { userData = null, close = null } = props;
    const { eventDispatcher = null, widgetHandler = null } = useRoomContext();
    const [ badges, setBadges ] = useState<string[]>([]);
    const [ motto, setMotto ] = useState(null);
    const [ isEditingMotto, setIsEditingMotto ] = useState(false);

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

    useEffect(() =>
    {
        setBadges(userData.badges);
        setIsEditingMotto(false);
        setMotto(userData.motto);
    }, [ userData ]);

    if(!userData) return null;

    return (
        <div className="d-flex flex-column bg-dark nitro-card nitro-infostand rounded">
            <div className="container-fluid content-area">
                <div className="d-flex justify-content-between align-items-center">
                    <div className="small text-wrap">{ userData.name }</div>
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
                                { badges[0] && <BadgeImageView badgeCode={ badges[0] } /> }
                            </div>
                            <div className="badge-image">
                                { userData.groupId > 0 && <BadgeImageView badgeCode={ userData.groupBadgeId } isGroup={ true } /> }
                            </div>
                        </div>
                        <div className="d-flex justify-content-between">
                            <div className="badge-image">
                                { badges[1] && <BadgeImageView badgeCode={ badges[1] } /> }
                            </div>
                            <div className="badge-image">
                                { badges[2] && <BadgeImageView badgeCode={ badges[2] } /> }
                            </div>
                        </div>
                        <div className="d-flex justify-content-between">
                            <div className="badge-image">
                                { badges[3] && <BadgeImageView badgeCode={ badges[3] } /> }
                            </div>
                            <div className="badge-image">
                                { badges[4] && <BadgeImageView badgeCode={ badges[4] } /> }
                            </div>
                        </div>
                    </div>
                </div>
                <hr className="m-0 my-1" />
                <div className="bg-light-dark rounded py-1 px-2 small">
                    { userData.type !== RoomWidgetUpdateInfostandUserEvent.OWN_USER && <div className="motto-content">{ motto }</div> }
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
                    </> }
            </div>
        </div>);
}
