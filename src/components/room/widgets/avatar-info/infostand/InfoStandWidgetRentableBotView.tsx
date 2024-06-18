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
        <div className="flex flex-col gap-1">
            <div className="flex flex-col nitro-infostand rounded">
                <div className="flex flex-col gap-1 overflow-visible container-fluid content-area">
                    <div className="flex flex-col gap-1">
                        <Flex alignItems="center" gap={ 1 } justifyContent="between">
                            <Text small wrap variant="white">{ avatarInfo.name }</Text>
                            <FaTimes className="cursor-pointer fa-icon" onClick={ onClose } />
                        </Flex>
                        <hr className="m-0" />
                    </div>
                    <div className="flex flex-col gap-1">
                        <div className="flex gap-1">
                            <Column fullWidth className="body-image bot">
                                <LayoutAvatarImageView direction={ 4 } figure={ avatarInfo.figure } />
                            </Column>
                            <Column center grow gap={ 0 }>
                                { (avatarInfo.badges.length > 0) && avatarInfo.badges.map(result =>
                                {
                                    return <LayoutBadgeImageView key={ result } badgeCode={ result } showInfo={ true } />;
                                }) }
                            </Column>
                        </div>
                        <hr className="m-0" />
                    </div>
                    <div className="flex flex-col gap-1">
                        <Flex alignItems="center" className="bg-light-dark rounded py-1 px-2">
                            <Text fullWidth small textBreak wrap className="min-h-[18px]" variant="white">{ avatarInfo.motto }</Text>
                        </Flex>
                        <hr className="m-0" />
                    </div>
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1">
                            <UserProfileIconView userId={ avatarInfo.ownerId } />
                            <Text small wrap variant="white">
                                { LocalizeText('infostand.text.botowner', [ 'name' ], [ avatarInfo.ownerName ]) }
                            </Text>
                        </div>
                        { (avatarInfo.carryItem > 0) &&
                            <>
                                <hr className="m-0" />
                                <Text small wrap variant="white">
                                    { LocalizeText('infostand.text.handitem', [ 'item' ], [ LocalizeText('handitem' + avatarInfo.carryItem) ]) }
                                </Text>
                            </> }
                    </div>
                </div>
            </div>
            { canPickup &&
                <div className="flex justify-end">
                    <Button variant="dark" onClick={ pickupBot }>{ LocalizeText('infostand.button.pickup') }</Button>
                </div> }
        </div>
    );
};
