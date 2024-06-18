import { FC } from 'react';
import { GetConfigurationValue, LocalizeText } from '../../../api';
import { LayoutRoomThumbnailView, NitroCardContentView, NitroCardHeaderView, NitroCardView, Text } from '../../../common';
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
            <NitroCardContentView className="text-black flex items-center">
                <div className="flex gap-2">
                    <LayoutRoomThumbnailView customUrl={ navigatorData.enteredGuestRoom.officialRoomPicRef } roomId={ navigatorData.enteredGuestRoom.roomId } />
                    <div className="flex flex-col">
                        <Text bold fontSize={ 5 }>{ LocalizeText('navigator.embed.headline') }</Text>
                        <Text>{ LocalizeText('navigator.embed.info') }</Text>
                        <input readOnly className="min-h-[calc(1.5em+ .5rem+2px)] px-[.5rem] py-[.25rem]  rounded-[.2rem] form-control-sm" type="text" value={ LocalizeText('navigator.embed.src', [ 'roomId' ], [ navigatorData.enteredGuestRoom.roomId.toString() ]).replace('${url.prefix}', GetConfigurationValue<string>('url.prefix', '')) } />
                    </div>
                </div>
            </NitroCardContentView>
        </NitroCardView>
    );
};
