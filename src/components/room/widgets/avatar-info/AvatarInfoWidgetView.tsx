import { RoomEngineEvent, RoomEnterEffect, RoomSessionDanceEvent } from '@nitrots/nitro-renderer';
import { FC, useState } from 'react';
import { AvatarInfoFurni, AvatarInfoPet, AvatarInfoRentableBot, AvatarInfoUser, GetConfiguration, GetSessionDataManager, RoomWidgetUpdateRentableBotChatEvent } from '../../../../api';
import { Column } from '../../../../common';
import { useAvatarInfoWidget, useRoom, useRoomEngineEvent, useRoomSessionManagerEvent, useUiEvent } from '../../../../hooks';
import { AvatarInfoPetTrainingPanelView } from './AvatarInfoPetTrainingPanelView';
import { AvatarInfoRentableBotChatView } from './AvatarInfoRentableBotChatView';
import { AvatarInfoUseProductConfirmView } from './AvatarInfoUseProductConfirmView';
import { AvatarInfoUseProductView } from './AvatarInfoUseProductView';
import { InfoStandWidgetBotView } from './infostand/InfoStandWidgetBotView';
import { InfoStandWidgetFurniView } from './infostand/InfoStandWidgetFurniView';
import { InfoStandWidgetPetView } from './infostand/InfoStandWidgetPetView';
import { InfoStandWidgetRentableBotView } from './infostand/InfoStandWidgetRentableBotView';
import { InfoStandWidgetUserView } from './infostand/InfoStandWidgetUserView';
import { AvatarInfoWidgetAvatarView } from './menu/AvatarInfoWidgetAvatarView';
import { AvatarInfoWidgetDecorateView } from './menu/AvatarInfoWidgetDecorateView';
import { AvatarInfoWidgetFurniView } from './menu/AvatarInfoWidgetFurniView';
import { AvatarInfoWidgetNameView } from './menu/AvatarInfoWidgetNameView';
import { AvatarInfoWidgetOwnAvatarView } from './menu/AvatarInfoWidgetOwnAvatarView';
import { AvatarInfoWidgetOwnPetView } from './menu/AvatarInfoWidgetOwnPetView';
import { AvatarInfoWidgetPetView } from './menu/AvatarInfoWidgetPetView';
import { AvatarInfoWidgetRentableBotView } from './menu/AvatarInfoWidgetRentableBotView';

export const AvatarInfoWidgetView: FC<{}> = props =>
{
    const [ isGameMode, setGameMode ] = useState(false);
    const [ isDancing, setIsDancing ] = useState(false);
    const [ rentableBotChatEvent, setRentableBotChatEvent ] = useState<RoomWidgetUpdateRentableBotChatEvent>(null);
    const { avatarInfo = null, setAvatarInfo = null, activeNameBubble = null, setActiveNameBubble = null, nameBubbles = [], removeNameBubble = null, productBubbles = [], confirmingProduct = null, updateConfirmingProduct = null, removeProductBubble = null, isDecorating = false, setIsDecorating = null } = useAvatarInfoWidget();
    const { roomSession = null } = useRoom();

    useRoomEngineEvent<RoomEngineEvent>(RoomEngineEvent.NORMAL_MODE, event =>
    {
        if(isGameMode) setGameMode(false);
    });

    useRoomEngineEvent<RoomEngineEvent>(RoomEngineEvent.GAME_MODE, event =>
    {
        if(!isGameMode) setGameMode(true);
    });

    useRoomSessionManagerEvent<RoomSessionDanceEvent>(RoomSessionDanceEvent.RSDE_DANCE, event =>
    {
        if(event.roomIndex !== roomSession.ownRoomIndex) return;

        setIsDancing((event.danceId !== 0));
    });

    useUiEvent<RoomWidgetUpdateRentableBotChatEvent>(RoomWidgetUpdateRentableBotChatEvent.UPDATE_CHAT, event => setRentableBotChatEvent(event));

    const getMenuView = () =>
    {
        if(!roomSession || isGameMode) return null;

        if(activeNameBubble) return <AvatarInfoWidgetNameView nameInfo={ activeNameBubble } onClose={ () => setActiveNameBubble(null) } />;

        if(avatarInfo)
        {
            switch(avatarInfo.type)
            {
                case AvatarInfoFurni.FURNI: {
                    const info = (avatarInfo as AvatarInfoFurni);

                    if(!isDecorating) return null;

                    return <AvatarInfoWidgetFurniView avatarInfo={ info } onClose={ () => setAvatarInfo(null) } />;
                }
                case AvatarInfoUser.OWN_USER:
                case AvatarInfoUser.PEER: {
                    const info = (avatarInfo as AvatarInfoUser);
                    if (GetConfiguration('user.tags.enabled')) GetSessionDataManager().getUserTags(info.roomIndex);

                    if(info.isSpectatorMode) return null;

                    if(info.isOwnUser)
                    {
                        if(RoomEnterEffect.isRunning()) return null;

                        return <AvatarInfoWidgetOwnAvatarView avatarInfo={ info } isDancing={ isDancing } setIsDecorating={ setIsDecorating } onClose={ () => setAvatarInfo(null) } />;
                    }

                    return <AvatarInfoWidgetAvatarView avatarInfo={ info } onClose={ () => setAvatarInfo(null) } />;
                }
                case AvatarInfoPet.PET_INFO: {
                    const info = (avatarInfo as AvatarInfoPet);

                    if(info.isOwner) return <AvatarInfoWidgetOwnPetView avatarInfo={ info } onClose={ () => setAvatarInfo(null) } />;

                    return <AvatarInfoWidgetPetView avatarInfo={ info } onClose={ () => setAvatarInfo(null) } />;
                }
                case AvatarInfoRentableBot.RENTABLE_BOT: {
                    return <AvatarInfoWidgetRentableBotView avatarInfo={ (avatarInfo as AvatarInfoRentableBot) } onClose={ () => setAvatarInfo(null) } />
                }
            }
        }

        return null;
    }

    const getInfostandView = () =>
    {
        if(!avatarInfo) return null;

        switch(avatarInfo.type)
        {
            case AvatarInfoFurni.FURNI:
                return <InfoStandWidgetFurniView avatarInfo={ (avatarInfo as AvatarInfoFurni) } onClose={ () => setAvatarInfo(null) } />;
            case AvatarInfoUser.OWN_USER:
            case AvatarInfoUser.PEER:
                return <InfoStandWidgetUserView avatarInfo={ (avatarInfo as AvatarInfoUser) } setAvatarInfo={ setAvatarInfo } onClose={ () => setAvatarInfo(null) } />;
            case AvatarInfoUser.BOT:
                return <InfoStandWidgetBotView avatarInfo={ (avatarInfo as AvatarInfoUser) } onClose={ () => setAvatarInfo(null) } />;
            case AvatarInfoRentableBot.RENTABLE_BOT:
                return <InfoStandWidgetRentableBotView avatarInfo={ (avatarInfo as AvatarInfoRentableBot) } onClose={ () => setAvatarInfo(null) } />;
            case AvatarInfoPet.PET_INFO:
                return <InfoStandWidgetPetView avatarInfo={ (avatarInfo as AvatarInfoPet) } onClose={ () => setAvatarInfo(null) } />
        }
    }

    return (
        <>
            { isDecorating &&
                <AvatarInfoWidgetDecorateView userId={ GetSessionDataManager().userId } userName={ GetSessionDataManager().userName } roomIndex={ roomSession.ownRoomIndex } setIsDecorating={ setIsDecorating } /> }
            { getMenuView() }
            { avatarInfo &&
                <Column alignItems="end" className="nitro-infostand-container">
                    { getInfostandView() }
                </Column> }
            { (nameBubbles.length > 0) && nameBubbles.map((name, index) => <AvatarInfoWidgetNameView key={ index } nameInfo={ name } onClose={ () => removeNameBubble(index) } />) }
            { (productBubbles.length > 0) && productBubbles.map((item, index) =>
            {
                return <AvatarInfoUseProductView key={ item.id } item={ item } updateConfirmingProduct={ updateConfirmingProduct } onClose={ () => removeProductBubble(index) } />;
            }) }
            { rentableBotChatEvent && <AvatarInfoRentableBotChatView chatEvent={ rentableBotChatEvent } onClose={ () => setRentableBotChatEvent(null) }/> }
            { confirmingProduct && <AvatarInfoUseProductConfirmView item={ confirmingProduct } onClose={ () => updateConfirmingProduct(null) } /> }
            <AvatarInfoPetTrainingPanelView />
        </>
    )
}
