import { HallOfFameEntryData } from '@nitrots/nitro-renderer';
import { FC } from 'react';
import { LocalizeFormattedNumber, LocalizeText } from '../../../../../api';
import { LayoutAvatarImageView, UserProfileIconView } from '../../../../../common';

export interface HallOfFameItemViewProps
{
    data: HallOfFameEntryData;
    level: number;
    active?: boolean;
}

export const HallOfFameItemView: FC<HallOfFameItemViewProps> = props =>
{
    const { data = null, level = 0, active = false } = props;



    return (
        <div className="group  h-full relative">
            <div className="invisible group-hover:visible absolute  w-[125px] max-w-[125px] p-[2px] bg-[#1c323f] border-[2px] border-[solid] border-[rgba(255,255,255,.5)] rounded-[.25rem]  z-40 -left-[15px] bottom-[calc(100%-10px)]">
                <div className="flex items-center justify-center gap-[5px] bg-[#3d5f6e] text-[#fff] min-w-[117px] h-[25px] max-h-[25px] text-[16px] mb-[2px]">
                    { level }. { data.userName } <UserProfileIconView userId={ data.userId } />
                </div>
                <div className="small text-center text-white">{ LocalizeText('landing.view.competition.hof.points', [ 'points' ], [ LocalizeFormattedNumber(data.currentScore).toString() ]) }</div>
            </div>
            <LayoutAvatarImageView direction={ 2 } figure={ data.figure } />
        </div>
    );
};
