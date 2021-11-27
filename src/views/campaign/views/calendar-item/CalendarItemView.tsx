import { FC, useCallback } from 'react';
import { GetRoomEngine, GetSessionDataManager } from '../../../../api';
import { NitroLayoutFlexColumn } from '../../../../layout';
import { CalendarItemState } from '../../common/CalendarItemState';
import { CalendarItemViewProps } from './CalendarItemView.types';

export const CalendarItemView: FC<CalendarItemViewProps> = props =>
{
    const { state = null,  productName = null, active = false, onClick = null, id = null } = props;
    
    const getFurnitureIcon = useCallback((name: string) =>
    {
        
        let furniData = GetSessionDataManager().getFloorItemDataByName(name);
        let url = null;
        if(furniData) url = GetRoomEngine().getFurnitureFloorIconUrl(furniData.id);
        else
        {
            furniData = GetSessionDataManager().getWallItemDataByName(name);
            if(furniData) url = GetRoomEngine().getFurnitureWallIconUrl(furniData.id);
        }

        return url;
    }, []);

    return (
        <NitroLayoutFlexColumn className={`calendar-item h-100 w-100 cursor-pointer align-items-center justify-content-center ${active ? 'active' : ''}`} onClick={() => onClick(id)}>
            { (state === CalendarItemState.STATE_UNLOCKED) &&
                <div className="unlocked-generic-bg d-flex justify-content-center align-items-center">
                    <div className="opened d-flex justify-content-center align-items-center">
                        { productName &&
                            <img className="furni-icon" src={getFurnitureIcon(productName)} alt='' />
                        }
                    </div>
                </div>
            }

            { (state !== CalendarItemState.STATE_UNLOCKED) &&
                <div className="locked-generic-bg d-flex justify-content-center align-items-center">
                    { (state === CalendarItemState.STATE_LOCKED_AVAILABLE) &&
                        <div className="available"/>
                    }
                    { (state === CalendarItemState.STATE_LOCKED_EXPIRED || state === CalendarItemState.STATE_LOCKED_FUTURE) &&
                        <div className="unavailable" />
                    }
                </div>
            }
        </NitroLayoutFlexColumn>
    );
}
