import { DesktopViewEvent, GetSessionDataManager } from '@nitrots/nitro-renderer';
import { FC, useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { Base, Column, Flex, Text } from '../../../../common';
import { useMessageEvent, useRoomPromote } from '../../../../hooks';
import { RoomPromoteEditWidgetView, RoomPromoteMyOwnEventWidgetView, RoomPromoteOtherEventWidgetView } from './views';

export const RoomPromotesWidgetView: FC<{}> = props =>
{
    const [ isEditingPromote, setIsEditingPromote ] = useState<boolean>(false);
    const [ isOpen, setIsOpen ] = useState<boolean>(true);
    const { promoteInformation, setPromoteInformation } = useRoomPromote();

    useMessageEvent<DesktopViewEvent>(DesktopViewEvent, event =>
    {
        setPromoteInformation(null);
    });

    if(!promoteInformation) return null;

    return (
        <>
            { promoteInformation.data.adId !== -1 &&
                <Base className="nitro-notification-bubble rounded">
                    <Column>
                        <Flex alignItems="center" justifyContent="between" pointer onClick={ event => setIsOpen(value => !value) }>
                            <Text variant="white" overflow="hidden">{ promoteInformation.data.eventName }</Text>
                            { isOpen && <FaChevronUp className="fa-icon" /> }
                            { !isOpen && <FaChevronDown className="fa-icon" /> }
                        </Flex>
                        { (isOpen && GetSessionDataManager().userId !== promoteInformation.data.ownerAvatarId) &&
                            <RoomPromoteOtherEventWidgetView
                                eventDescription={ promoteInformation.data.eventDescription }
                            />
                        }
                        { (isOpen && GetSessionDataManager().userId === promoteInformation.data.ownerAvatarId) &&
                            <RoomPromoteMyOwnEventWidgetView
                                eventDescription={ promoteInformation.data.eventDescription }
                                setIsEditingPromote={ () => setIsEditingPromote(true) }
                            />
                        }
                        { isEditingPromote &&
                            <RoomPromoteEditWidgetView
                                eventId={ promoteInformation.data.adId }
                                eventName={ promoteInformation.data.eventName }
                                eventDescription={ promoteInformation.data.eventDescription }
                                setIsEditingPromote={ () => setIsEditingPromote(false) }
                            />
                        }
                    </Column>
                </Base>
            }
        </>
    );
};
