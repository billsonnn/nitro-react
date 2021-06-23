import { BotRemoveComposer } from 'nitro-renderer';
import { FC, useCallback, useMemo } from 'react';
import { GetConnection } from '../../../../../../api';
import { LocalizeText } from '../../../../../../utils/LocalizeText';
import { AvatarImageView } from '../../../../../avatar-image/AvatarImageView';
import { BadgeImageView } from '../../../../../badge-image/BadgeImageView';
import { BotSkillsEnum } from '../../../avatar-info/utils/BotSkillsEnum';
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
        GetConnection().send(new BotRemoveComposer(rentableBotData.webID));
    }, [ rentableBotData ]);

    if(!rentableBotData) return;

    return (
        <>
            <div className="d-flex flex-column bg-dark nitro-card nitro-infostand rounded">
                <div className="container-fluid content-area">
                    <div className="d-flex justify-content-between align-items-center">
                        <div className="small text-wrap">{ rentableBotData.name }</div>
                        <i className="fas fa-times cursor-pointer" onClick={ close }></i>
                    </div>
                    <hr className="m-0 my-1" />
                    <div className="d-flex">
                        <div className="body-image bot w-100">
                            <AvatarImageView figure={ rentableBotData.figure } direction={ 4 } />
                        </div>
                        <div className="w-100 d-flex justify-content-center align-items-center">
                            { (rentableBotData.badges.length > 0) && rentableBotData.badges.map((result, index) =>
                                {
                                    return <BadgeImageView key={ index } badgeCode={ result } />;
                                }) }
                        </div>
                    </div>
                    <hr className="m-0 my-1" />
                    <div className="motto-content small">{ rentableBotData.motto }</div>
                    <hr className="m-0 my-1" />
                    <div className="d-flex align-items-center">
                        <i className="icon icon-user-profile me-1 cursor-pointer" />
                        <div className="small text-wrap">{ LocalizeText('infostand.text.botowner', [ 'name' ], [ rentableBotData.ownerName ]) }</div>
                    </div>
                    { (rentableBotData.carryItem > 0) &&
                        <>
                            <hr className="m-0 my-1"/>
                            <div className="small text-wrap">
                                { LocalizeText('infostand.text.handitem', [ 'item' ], [ LocalizeText('handitem' + rentableBotData.carryItem) ]) }
                            </div>
                        </> }
                </div>
            </div>
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
