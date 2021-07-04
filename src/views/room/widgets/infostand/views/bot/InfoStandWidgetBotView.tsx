import { FC, useCallback } from 'react';
import { LocalizeText } from '../../../../../../utils/LocalizeText';
import { AvatarImageView } from '../../../../../shared/avatar-image/AvatarImageView';
import { BadgeImageView } from '../../../../../shared/badge-image/BadgeImageView';
import { InfoStandBaseView } from '../base/InfoStandBaseView';
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
        <InfoStandBaseView headerText={ botData.name } onCloseClick={ close }>
            <div className="d-flex">
                <div className="body-image bot w-100">
                    <AvatarImageView figure={ botData.figure } direction={ 4 } />
                </div>
                <div className="w-100 d-flex justify-content-center align-items-center">
                    { (botData.badges.length > 0) && botData.badges.map(result =>
                        {
                            return <BadgeImageView key={ result } badgeCode={ result } />;
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
        </InfoStandBaseView>
    );
}
