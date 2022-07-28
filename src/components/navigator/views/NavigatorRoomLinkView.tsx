import { FC } from 'react';
import { GetConfiguration, LocalizeText } from '../../../api';
import { Column, Flex, LayoutRoomThumbnailView, NitroCardContentView, NitroCardHeaderView, NitroCardView, Text } from '../../../common';
import { useNavigator } from '../../../hooks';

export class NavigatorRoomLinkViewProps
{
    onCloseClick: () => void;
}

export const NavigatorRoomLinkView: FC<NavigatorRoomLinkViewProps> = props =>
{
    const { onCloseClick = null } = props;
    const { navigatorData = null } = useNavigator();

    if(!navigatorData.enteredGuestRoom) return null;
    
    return (
        <NitroCardView className="nitro-room-link" theme="primary-slim">
            <NitroCardHeaderView headerText={ LocalizeText('navigator.embed.title') } onCloseClick={ onCloseClick } />
            <NitroCardContentView className="text-black d-flex align-items-center">
                <Flex gap={ 2 }>
                    <LayoutRoomThumbnailView roomId={ navigatorData.enteredGuestRoom.roomId } customUrl={ navigatorData.enteredGuestRoom.officialRoomPicRef } />
                    <Column>
                        <Text bold fontSize={ 5 }>{ LocalizeText('navigator.embed.headline') }</Text>
                        <Text>{ LocalizeText('navigator.embed.info') }</Text>
                        <input type="text" readOnly className="form-control form-control-sm" value={ LocalizeText('navigator.embed.src', [ 'roomId' ], [ navigatorData.enteredGuestRoom.roomId.toString() ]).replace('${url.prefix}', GetConfiguration<string>('url.prefix', '')) } />
                    </Column>
                </Flex>
            </NitroCardContentView>
        </NitroCardView>
    );
};
