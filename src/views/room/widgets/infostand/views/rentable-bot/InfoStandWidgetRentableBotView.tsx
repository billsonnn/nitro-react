import { BotRemoveComposer } from '@nitrots/nitro-renderer';
import { FC, useCallback, useMemo } from 'react';
import { LocalizeText } from '../../../../../../api';
import { SendMessageHook } from '../../../../../../hooks';
import { UserProfileIconView } from '../../../../../../layout';
import { AvatarImageView } from '../../../../../shared/avatar-image/AvatarImageView';
import { BadgeImageView } from '../../../../../shared/badge-image/BadgeImageView';
import { BotSkillsEnum } from '../../../avatar-info/common/BotSkillsEnum';
import { InfoStandBaseView } from '../base/InfoStandBaseView';
import { InfoStandWidgetRentableBotViewProps } from './InfoStandWidgetRentableBotView.types';

export const InfoStandWidgetRentableBotView: FC<InfoStandWidgetRentableBotViewProps> = props =>
{
    const { rentableBotData = null, close = null } = props;

    const canPickup = useMemo(() =>
    {
        if(rentableBotData.botSkills.indexOf(BotSkillsEnum.NO_PICK_UP) >= 0) return false;

        if(!rentableBotData.amIOwner && !rentableBotData.amIAnyRoomController) return false;

        return true;
    }, [ rentableBotData ]);

    const pickupBot = useCallback(() =>
    {
        SendMessageHook(new BotRemoveComposer(rentableBotData.webID));
    }, [ rentableBotData ]);
    
    if(!rentableBotData) return;

    return (
        <>
            <InfoStandBaseView headerText={ rentableBotData.name } onCloseClick={ close }>
                <div className="d-flex">
                    <div className="body-image bot w-100">
                        <AvatarImageView figure={ rentableBotData.figure } direction={ 4 } />
                    </div>
                    <div className="w-100 d-flex justify-content-center align-items-center">
                        { (rentableBotData.badges.length > 0) && rentableBotData.badges.map(result =>
                            {
                                return <BadgeImageView key={ result } badgeCode={ result } showInfo={ true } />;
                            }) }
                    </div>
                </div>
                <hr className="m-0 my-1" />
                <div className="motto-content small">{ rentableBotData.motto }</div>
                <hr className="m-0 my-1" />
                <div className="d-flex align-items-center">
                    <UserProfileIconView userId={ rentableBotData.ownerId } />
                    <div className="small text-wrap">{ LocalizeText('infostand.text.botowner', [ 'name' ], [ rentableBotData.ownerName ]) }</div>
                </div>
                { (rentableBotData.carryItem > 0) &&
                    <>
                        <hr className="m-0 my-1"/>
                        <div className="small text-wrap">
                            { LocalizeText('infostand.text.handitem', [ 'item' ], [ LocalizeText('handitem' + rentableBotData.carryItem) ]) }
                        </div>
                    </> }
            </InfoStandBaseView>
            { canPickup &&
                <div className="button-container mt-2">
                    <button type="button" className="btn btn-sm btn-danger ms-1" onClick={ pickupBot }>
                        <i className="me-1 fas fa-box-open"></i>
                        { LocalizeText('infostand.button.pickup') }
                    </button>
                </div> }
        </>
    );
}
