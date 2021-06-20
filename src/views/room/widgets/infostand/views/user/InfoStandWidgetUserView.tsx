import classNames from 'classnames';
import { FC, KeyboardEvent, useCallback, useEffect, useRef, useState } from 'react';
import { LocalizeText } from '../../../../../../utils/LocalizeText';
import { AvatarImageView } from '../../../../../avatar-image/AvatarImageView';
import { BadgeImageView } from '../../../../../badge-image/BadgeImageView';
import { RoomWidgetUpdateInfostandUserEvent } from '../../../../events/RoomWidgetUpdateInfostandUserEvent';
import { InfoStandWidgetUserViewProps } from './InfoStandWidgetUserView.types';

export const InfoStandWidgetUserView: FC<InfoStandWidgetUserViewProps> = props =>
{
    const { userData = null, close = null } = props;

    const [ motto, setMotto ]                       = useState(null);
    const [ isEditingMotto, setIsEditingMotto ]   = useState(false);

    const inputRef = useRef<HTMLInputElement>();

    useEffect(() =>
    {
        setIsEditingMotto(false);
        setMotto(null);
        
        if(!motto) setMotto(userData.motto);
    }, [ userData ]);

    const saveMotto = useCallback(() =>
    {
        setIsEditingMotto(false);
    }, [ motto ]);

    const editMotto = useCallback(() =>
    {
        setIsEditingMotto(true);
        setTimeout(() =>
        {
            if(inputRef.current) inputRef.current.focus();
        }, 100);
    }, [ inputRef ]);

    const onKeyDownEvent = useCallback((event: KeyboardEvent<HTMLInputElement>) =>
    {
        switch(event.key)
        {
            case 'Enter':
                saveMotto();

                const target = (event.target as HTMLInputElement);
                target.blur();
                return;
        }
        
    }, []);

    return (
        <>
            <div className="d-flex flex-column bg-dark nitro-card nitro-infostand rounded nitro-infostand-user">
                <div className="container-fluid content-area">
                    <div className="d-flex justify-content-between align-items-center">
                        <div>{ userData.name }</div>
                        <i className="fas fa-times cursor-pointer" onClick={ close }></i>
                    </div>
                    <hr className="m-0 my-1"/>
                    <div className="d-flex">
                        <div className="body-image w-100">
                            <AvatarImageView figure={ userData.figure } direction={ 4 } />
                        </div>
                        <div>
                            <div className="d-flex justify-content-between">
                                <div className="badge-image">
                                    { userData.badges[0] && <BadgeImageView badgeCode={ userData.badges[0] } /> }
                                </div>
                                <div className="badge-image">
                                    { userData.groupId > 0 && <BadgeImageView badgeCode={ userData.groupBadgeId } isGroup={ true } /> }
                                </div>
                            </div>
                            <div className="d-flex justify-content-between">
                                <div className="badge-image">
                                    { userData.badges[1] && <BadgeImageView badgeCode={ userData.badges[1] } /> }
                                </div>
                                <div className="badge-image">
                                    { userData.badges[2] && <BadgeImageView badgeCode={ userData.badges[2] } /> }
                                </div>
                            </div>
                            <div className="d-flex justify-content-between">
                                <div className="badge-image">
                                    { userData.badges[3] && <BadgeImageView badgeCode={ userData.badges[3] } /> }
                                </div>
                                <div className="badge-image">
                                    { userData.badges[4] && <BadgeImageView badgeCode={ userData.badges[4] } /> }
                                </div>
                            </div>
                        </div>
                    </div>
                    <hr className="m-0 my-1"/>
                    <div className="bg-secondary rounded py-1 px-2 small">
                        { userData.type !== RoomWidgetUpdateInfostandUserEvent.OWN_USER && <div className="motto-content">{ motto }</div> }
                        { userData.type === RoomWidgetUpdateInfostandUserEvent.OWN_USER && <div className="d-flex justify-content-between align-items-center">
                            <div className="me-2">
                                <i className="fas fa-pencil-alt"></i>
                            </div>
                            <div className="h-100 w-100">
                                { !isEditingMotto && <div className="motto-content cursor-pointer w-100 text-wrap text-break" onClick={ () => editMotto() }>{ motto }</div> }
                                <input ref={ inputRef } type="text" className={ "motto-input" + classNames({ ' d-none': !isEditingMotto }) } maxLength={ 38 } value={ motto } onChange={ event => setMotto(event.target.value) } onBlur={ () => saveMotto() } onKeyDown={ event => onKeyDownEvent(event) }/>
                            </div>
                        </div> }
                    </div>
                    <hr className="m-0 my-1"/>
                    <div>
                        { LocalizeText('infostand.text.achievement_score') + ' ' + userData.achievementScore }
                    </div>
                    { userData.carryItem > 0 && <>
                        <hr className="m-0 my-1"/>
                        { LocalizeText('infostand.text.handitem', ['item'], [LocalizeText('handitem' + userData.carryItem)]) }
                    </> }
                </div>
            </div>
        </>);
}
