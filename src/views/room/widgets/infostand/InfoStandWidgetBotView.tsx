import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FC } from 'react';
import { LocalizeText, RoomWidgetUpdateInfostandUserEvent } from '../../../../api';
import { Column, Flex, Text } from '../../../../common';
import { AvatarImageView } from '../../../shared/avatar-image/AvatarImageView';
import { BadgeImageView } from '../../../shared/badge-image/BadgeImageView';

interface InfoStandWidgetBotViewProps
{
    botData: RoomWidgetUpdateInfostandUserEvent;
    close: () => void;
}

export const InfoStandWidgetBotView: FC<InfoStandWidgetBotViewProps> = props =>
{
    const { botData = null, close = null } = props;

    if(!botData) return null;

    return (
        <Column className="nitro-infostand rounded">
            <Column overflow="visible" className="container-fluid content-area" gap={ 1 }>
                <Column gap={ 1 }>
                    <Flex alignItems="center" justifyContent="between" gap={ 1 }>
                        <Text variant="white" small wrap>{ botData.name }</Text>
                        <FontAwesomeIcon icon="times" className="cursor-pointer" onClick={ close } />
                    </Flex>
                    <hr className="m-0" />
                </Column>
                <Column gap={ 1 }>
                    <Flex gap={ 1 }>
                        <Column fullWidth className="body-image bot">
                            <AvatarImageView figure={ botData.figure } direction={ 4 } />
                        </Column>
                        <Column grow center gap={ 0 }>
                            { (botData.badges.length > 0) && botData.badges.map(result =>
                            {
                                return <BadgeImageView key={ result } badgeCode={ result } showInfo={ true } />;
                            }) }
                        </Column>
                    </Flex>
                    <hr className="m-0" />
                </Column>
                <Flex alignItems="center" className="bg-light-dark rounded py-1 px-2">
                    <Text fullWidth wrap textBreak variant="white" small className="motto-content">{ botData.motto }</Text>
                </Flex>
                { (botData.carryItem > 0) &&
                    <Column gap={ 1 }>
                        <hr className="m-0" />
                        <Text variant="white" small wrap>
                            { LocalizeText('infostand.text.handitem', [ 'item' ], [ LocalizeText('handitem' + botData.carryItem) ]) }
                        </Text>
                    </Column> }
            </Column>
        </Column>
    );
}
