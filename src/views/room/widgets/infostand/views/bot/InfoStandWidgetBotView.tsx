import { RoomControllerLevel } from 'nitro-renderer';
import { FC, useCallback, useEffect, useState } from 'react';
import { LocalizeText } from '../../../../../../utils/LocalizeText';
import { AvatarImageView } from '../../../../../avatar-image/AvatarImageView';
import { BadgeImageView } from '../../../../../badge-image/BadgeImageView';
import { InfoStandWidgetBotViewProps } from './InfoStandWidgetBotView.types';

export const InfoStandWidgetBotView: FC<InfoStandWidgetBotViewProps> = props =>
{
    const { botData = null, close = null } = props;

    const [ canPickup, setCanPickup ] = useState(false);

    useEffect(() =>
    {
        setCanPickup(false);

        if(botData.amIOwner || botData.amIAnyRoomController || botData.roomControllerLevel >= RoomControllerLevel.MODERATOR)
            setCanPickup(true);
            
    }, [ botData ]);

    const processButtonAction = useCallback((action: string) =>
    {
        if(!action || (action === '')) return;

    }, []);

    if(!botData) return null;

    return (
        <>
            <div className="d-flex flex-column bg-dark nitro-card nitro-infostand rounded nitro-infostand-user">
                <div className="container-fluid content-area">
                    <div className="d-flex justify-content-between align-items-center">
                        <div>{ botData.name }</div>
                        <i className="fas fa-times cursor-pointer" onClick={ close }></i>
                    </div>
                    <hr className="m-0 my-1"/>
                    <div className="d-flex">
                        <div className="body-image bot w-100">
                            <AvatarImageView figure={ botData.figure } direction={ 4 } />
                        </div>
                        <div className="w-100 d-flex justify-content-center align-items-center">
                            <BadgeImageView badgeCode="BOT" />
                        </div>
                    </div>
                    <hr className="m-0 my-1"/>
                    <div className="bg-secondary rounded py-1 px-2 small">
                        <div className="motto-content">{ botData.motto }</div>
                    </div>
                </div>
            </div>
            { canPickup && <div className="button-container mt-2">
                <button type="button" className="btn btn-sm btn-danger ms-1" onClick={event => processButtonAction('pickup')}>
                        <i className="me-1 fas fa-eject"></i>
                        {LocalizeText('infostand.button.pickup')}
                    </button>
            </div> }
        </>
    );
}
