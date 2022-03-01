import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { BotRemoveComposer } from '@nitrots/nitro-renderer';
import { FC, useMemo } from 'react';
import { LocalizeText, RoomWidgetUpdateInfostandRentableBotEvent } from '../../../../api';
import { Button, Column, Flex, Text } from '../../../../common';
import { SendMessageHook } from '../../../../hooks';
import { UserProfileIconView } from '../../../../layout';
import { AvatarImageView } from '../../../shared/avatar-image/AvatarImageView';
import { BadgeImageView } from '../../../shared/badge-image/BadgeImageView';
import { BotSkillsEnum } from '../avatar-info/common/BotSkillsEnum';

interface InfoStandWidgetRentableBotViewProps
{
    rentableBotData: RoomWidgetUpdateInfostandRentableBotEvent;
    close: () => void;
}

export const InfoStandWidgetRentableBotView: FC<InfoStandWidgetRentableBotViewProps> = props =>
{
    const { rentableBotData = null, close = null } = props;

    const canPickup = useMemo(() =>
    {
        if(rentableBotData.botSkills.indexOf(BotSkillsEnum.NO_PICK_UP) >= 0) return false;

        if(!rentableBotData.amIOwner && !rentableBotData.amIAnyRoomController) return false;

        return true;
    }, [ rentableBotData ]);

    const pickupBot = () => SendMessageHook(new BotRemoveComposer(rentableBotData.webID));
    
    if(!rentableBotData) return;

    return (
        <Column gap={ 1 }>
            <Column className="nitro-infostand rounded">
                <Column overflow="visible" className="container-fluid content-area" gap={ 1 }>
                    <Column gap={ 1 }>
                        <Flex alignItems="center" justifyContent="between" gap={ 1 }>
                            <Text variant="white" small wrap>{ rentableBotData.name }</Text>
                            <FontAwesomeIcon icon="times" className="cursor-pointer" onClick={ close } />
                        </Flex>
                        <hr className="m-0" />
                    </Column>
                    <Column gap={ 1 }>
                        <Flex gap={ 1 }>
                            <Column fullWidth className="body-image bot">
                                <AvatarImageView figure={ rentableBotData.figure } direction={ 4 } />
                            </Column>
                            <Column grow center gap={ 0 }>
                                { (rentableBotData.badges.length > 0) && rentableBotData.badges.map(result =>
                                {
                                    return <BadgeImageView key={ result } badgeCode={ result } showInfo={ true } />;
                                }) }
                            </Column>
                        </Flex>
                        <hr className="m-0" />
                    </Column>
                    <Column gap={ 1 }>
                        <Flex alignItems="center" className="bg-light-dark rounded py-1 px-2">
                            <Text fullWidth wrap textBreak variant="white" small className="motto-content">{ rentableBotData.motto }</Text>
                        </Flex>
                        <hr className="m-0" />
                    </Column>
                    <Column gap={ 1 }>
                        <Flex alignItems="center" gap={ 1 }>
                            <UserProfileIconView userId={ rentableBotData.ownerId } />
                            <Text variant="white" small wrap>
                                { LocalizeText('infostand.text.botowner', [ 'name' ], [ rentableBotData.ownerName ]) }
                            </Text>
                        </Flex>
                        { (rentableBotData.carryItem > 0) &&
                            <>
                                <hr className="m-0" />
                                <Text variant="white" small wrap>
                                    { LocalizeText('infostand.text.handitem', [ 'item' ], [ LocalizeText('handitem' + rentableBotData.carryItem) ]) }
                                </Text>
                            </> }
                    </Column>
                </Column>
            </Column>
            { canPickup &&
                <Flex justifyContent="end">
                    <Button variant="dark" onClick={ pickupBot }>{ LocalizeText('infostand.button.pickup') }</Button>
                </Flex> }
        </Column>
    );
}
