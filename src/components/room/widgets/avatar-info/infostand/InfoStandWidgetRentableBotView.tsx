import { BotRemoveComposer } from '@nitrots/nitro-renderer';
import { FC, useMemo } from 'react';
import { FaTimes } from 'react-icons/fa';
import { AvatarInfoRentableBot, BotSkillsEnum, LocalizeText, SendMessageComposer } from '../../../../../api';
import { Button, Column, Flex, LayoutAvatarImageView, LayoutBadgeImageView, Text, UserProfileIconView } from '../../../../../common';

interface InfoStandWidgetRentableBotViewProps
{
    avatarInfo: AvatarInfoRentableBot;
    onClose: () => void;
}

export const InfoStandWidgetRentableBotView: FC<InfoStandWidgetRentableBotViewProps> = props =>
{
    const { avatarInfo = null, onClose = null } = props;

    const canPickup = useMemo(() =>
    {
        if(avatarInfo.botSkills.indexOf(BotSkillsEnum.NO_PICK_UP) >= 0) return false;

        if(!avatarInfo.amIOwner && !avatarInfo.amIAnyRoomController) return false;

        return true;
    }, [ avatarInfo ]);

    const pickupBot = () => SendMessageComposer(new BotRemoveComposer(avatarInfo.webID));
    
    if(!avatarInfo) return;

    return (
        <Column gap={ 1 }>
            <Column className="nitro-infostand rounded">
                <Column overflow="visible" className="container-fluid content-area" gap={ 1 }>
                    <Column gap={ 1 }>
                        <Flex alignItems="center" justifyContent="between" gap={ 1 }>
                            <Text variant="white" small wrap>{ avatarInfo.name }</Text>
                            <FaTimes className="cursor-pointer fa-icon" onClick={ onClose } />
                        </Flex>
                        <hr className="m-0" />
                    </Column>
                    <Column gap={ 1 }>
                        <Flex gap={ 1 }>
                            <Column fullWidth className="body-image bot">
                                <LayoutAvatarImageView figure={ avatarInfo.figure } direction={ 4 } />
                            </Column>
                            <Column grow center gap={ 0 }>
                                { (avatarInfo.badges.length > 0) && avatarInfo.badges.map(result =>
                                {
                                    return <LayoutBadgeImageView key={ result } badgeCode={ result } showInfo={ true } />;
                                }) }
                            </Column>
                        </Flex>
                        <hr className="m-0" />
                    </Column>
                    <Column gap={ 1 }>
                        <Flex alignItems="center" className="bg-light-dark rounded py-1 px-2">
                            <Text fullWidth wrap textBreak variant="white" small className="motto-content">{ avatarInfo.motto }</Text>
                        </Flex>
                        <hr className="m-0" />
                    </Column>
                    <Column gap={ 1 }>
                        <Flex alignItems="center" gap={ 1 }>
                            <UserProfileIconView userId={ avatarInfo.ownerId } />
                            <Text variant="white" small wrap>
                                { LocalizeText('infostand.text.botowner', [ 'name' ], [ avatarInfo.ownerName ]) }
                            </Text>
                        </Flex>
                        { (avatarInfo.carryItem > 0) &&
                            <>
                                <hr className="m-0" />
                                <Text variant="white" small wrap>
                                    { LocalizeText('infostand.text.handitem', [ 'item' ], [ LocalizeText('handitem' + avatarInfo.carryItem) ]) }
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
