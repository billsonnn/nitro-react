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
                <Flex alignItems="center" className="bg-light-dark rounded py-1 px-2">
                    <Text fullWidth wrap textBreak variant="white" small className="motto-content">{ avatarInfo.motto }</Text>
                </Flex>
                { (avatarInfo.carryItem > 0) &&
                    <Column gap={ 1 }>
                        <hr className="m-0" />
                        <Text variant="white" small wrap>
                            { LocalizeText('infostand.text.handitem', [ 'item' ], [ LocalizeText('handitem' + avatarInfo.carryItem) ]) }
                        </Text>
                    </Column> }
            </Column>
        </Column>
    );
}
