import { FC, useCallback } from 'react';
import { LocalizeText } from '../../../../../../utils/LocalizeText';
import { AvatarImageView } from '../../../../../shared/avatar-image/AvatarImageView';
import { BadgeImageView } from '../../../../../shared/badge-image/BadgeImageView';
import { InfoStandWidgetBotViewProps } from './InfoStandWidgetBotView.types';

export const InfoStandWidgetBotView: FC<InfoStandWidgetBotViewProps> = props =>
{
    const { botData = null, close = null } = props;

    const processButtonAction = useCallback((action: string) =>
    {
        if(!action || (action === '')) return;

    }, []);

    if(!botData) return null;

    return (
        <div className="d-flex flex-column bg-dark nitro-card nitro-infostand rounded">
            <div className="container-fluid content-area">
                <div className="d-flex justify-content-between align-items-center">
                    <div className="small text-wrap">{ botData.name }</div>
                    <i className="fas fa-times cursor-pointer" onClick={ close }></i>
                </div>
                <hr className="m-0 my-1" />
                <div className="d-flex">
                    <div className="body-image bot w-100">
                        <AvatarImageView figure={ botData.figure } direction={ 4 } />
                    </div>
                    <div className="w-100 d-flex justify-content-center align-items-center">
                        { (botData.badges.length > 0) && botData.badges.map((result, index) =>
                            {
                                return <BadgeImageView key={ index } badgeCode={ result } />;
                            }) }
                    </div>
                </div>
                <hr className="m-0 my-1" />
                <div className="motto-content small">{ botData.motto }</div>
                { (botData.carryItem > 0) &&
                    <>
                        <hr className="m-0 my-1" />
                        <div className="small text-wrap">
                            { LocalizeText('infostand.text.handitem', [ 'item' ], [ LocalizeText('handitem' + botData.carryItem) ]) }
                        </div>
                    </> }
            </div>
        </div>
    );
}
