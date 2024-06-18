import { FC } from 'react';
import { FaTimes } from 'react-icons/fa';
import { AvatarInfoUser, LocalizeText } from '../../../../../api';
import { Column, Flex, LayoutAvatarImageView, LayoutBadgeImageView, Text } from '../../../../../common';

interface InfoStandWidgetBotViewProps
{
    avatarInfo: AvatarInfoUser;
    onClose: () => void;
}

export const InfoStandWidgetBotView: FC<InfoStandWidgetBotViewProps> = props =>
{
    const { avatarInfo = null, onClose = null } = props;

    if(!avatarInfo) return null;

    return (
        <Column className="nitro-infostand rounded">
            <Column className="container-fluid content-area" gap={ 1 } overflow="visible">
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
                <Flex alignItems="center" className="bg-light-dark rounded py-1 px-2">
                    <Text fullWidth small textBreak wrap className="min-h-[18px]" variant="white">{ avatarInfo.motto }</Text>
                </Flex>
                { (avatarInfo.carryItem > 0) &&
                    <div className="flex flex-col gap-1">
                        <hr className="m-0" />
                        <Text small wrap variant="white">
                            { LocalizeText('infostand.text.handitem', [ 'item' ], [ LocalizeText('handitem' + avatarInfo.carryItem) ]) }
                        </Text>
                    </div> }
            </Column>
        </Column>
    );
};
