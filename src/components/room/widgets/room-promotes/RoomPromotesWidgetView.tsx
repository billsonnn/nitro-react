import { DesktopViewEvent, GetSessionDataManager } from '@nitrots/nitro-renderer';
import { FC, useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { Flex, Text } from '../../../../common';
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
                <div className="px-[5px] py-[6px] [box-shadow:inset_0_5px_#22222799,_inset_0_-4px_#12121599] text-sm  bg-[#1c1c20f2] rounded">
                    <div className="flex flex-col">
                        <Flex pointer alignItems="center" justifyContent="between" onClick={ event => setIsOpen(value => !value) }>
                            <Text overflow="hidden" variant="white">{ promoteInformation.data.eventName }</Text>
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
                                eventDescription={ promoteInformation.data.eventDescription }
                                eventId={ promoteInformation.data.adId }
                                eventName={ promoteInformation.data.eventName }
                                setIsEditingPromote={ () => setIsEditingPromote(false) }
                            />
                        }
                    </div>
                </div>
            }
        </>
    );
};
