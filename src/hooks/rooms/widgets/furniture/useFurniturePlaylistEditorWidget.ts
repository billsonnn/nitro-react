import { AddJukeboxDiskComposer, AdvancedMap, FurnitureListAddOrUpdateEvent, FurnitureListEvent, FurnitureListRemovedEvent, FurnitureMultiStateComposer, IAdvancedMap, IMessageEvent, ISongInfo, NotifyPlayedSongEvent, NowPlayingEvent, PlayListStatusEvent, RemoveJukeboxDiskComposer, RoomControllerLevel, RoomEngineTriggerWidgetEvent, SongDiskInventoryReceivedEvent } from '@nitrots/nitro-renderer';
import { useCallback, useState } from 'react';
import { GetNitroInstance, GetRoomEngine, GetSessionDataManager, IsOwnerOfFurniture, LocalizeText, NotificationAlertType, NotificationBubbleType, SendMessageComposer } from '../../../../api';
import { useMessageEvent, useRoomEngineEvent, useSoundEvent } from '../../../events';
import { useNotification } from '../../../notification';
import { useFurniRemovedEvent } from '../../engine';
import { useRoom } from '../../useRoom';

const useFurniturePlaylistEditorWidgetState = () =>
{
    const [ objectId, setObjectId ] = useState(-1);
    const [ category, setCategory ] = useState(-1);
    const [ currentPlayingIndex, setCurrentPlayingIndex ] = useState(-1);
    const [ diskInventory, setDiskInventory ] = useState<IAdvancedMap<number, number>>(new AdvancedMap());
    const [ playlist, setPlaylist ] = useState<ISongInfo[]>([]);
    const { roomSession = null } = useRoom();
    const { showSingleBubble = null, simpleAlert = null } = useNotification();

    const onClose = () =>
    {
        setObjectId(-1);
        setCategory(-1);
    }

    const addToPlaylist = useCallback((diskId: number, slotNumber: number) => SendMessageComposer(new AddJukeboxDiskComposer(diskId, slotNumber)), []);

    const removeFromPlaylist = useCallback((slotNumber: number) => SendMessageComposer(new RemoveJukeboxDiskComposer(slotNumber)), []);

    const togglePlayPause = useCallback((furniId: number, position: number) => SendMessageComposer(new FurnitureMultiStateComposer(furniId, position)), []);

    useRoomEngineEvent<RoomEngineTriggerWidgetEvent>(RoomEngineTriggerWidgetEvent.REQUEST_PLAYLIST_EDITOR, event =>
    {
        const roomObject = GetRoomEngine().getRoomObject(event.roomId, event.objectId, event.category);

        if(!roomObject) return;

        if(IsOwnerOfFurniture(roomObject))
        {
            // show the editor
            setObjectId(event.objectId);
            setCategory(event.category);

            GetNitroInstance().soundManager.musicController?.requestUserSongDisks();
            GetNitroInstance().soundManager.musicController?.getRoomItemPlaylist()?.requestPlayList();

            return;
        }

        if(roomSession.isRoomOwner || (roomSession.controllerLevel >= RoomControllerLevel.GUEST) || GetSessionDataManager().isModerator) SendMessageComposer(new FurnitureMultiStateComposer(event.objectId, -2));
    });

    useFurniRemovedEvent(((objectId !== -1) && (category !== -1)), event =>
    {
        if((event.id !== objectId) || (event.category !== category)) return;

        onClose();
    });

    useSoundEvent<NowPlayingEvent>(NowPlayingEvent.NPE_SONG_CHANGED, event =>
    {
        setCurrentPlayingIndex(event.position);
    });

    useSoundEvent<NotifyPlayedSongEvent>(NotifyPlayedSongEvent.NOTIFY_PLAYED_SONG, event =>
    {
        showSingleBubble(LocalizeText('soundmachine.notification.playing', [ 'songname', 'songauthor' ], [ event.name, event.creator ]), NotificationBubbleType.SOUNDMACHINE)
    });

    useSoundEvent<SongDiskInventoryReceivedEvent>(SongDiskInventoryReceivedEvent.SDIR_SONG_DISK_INVENTORY_RECEIVENT_EVENT, event =>
    {
        setDiskInventory(GetNitroInstance().soundManager.musicController?.songDiskInventory.clone());
    });

    useSoundEvent<PlayListStatusEvent>(PlayListStatusEvent.PLUE_PLAY_LIST_UPDATED, event =>
    {
        setPlaylist(GetNitroInstance().soundManager.musicController?.getRoomItemPlaylist()?.entries.concat())
    });

    useSoundEvent<PlayListStatusEvent>(PlayListStatusEvent.PLUE_PLAY_LIST_FULL, event =>
    {
        simpleAlert(LocalizeText('playlist.editor.alert.playlist.full'), NotificationAlertType.ALERT, '', '', LocalizeText('playlist.editor.alert.playlist.full.title'));
    });

    const onFurniListUpdated = (event : IMessageEvent) =>
    {
        if(objectId === -1) return;

        if(event instanceof FurnitureListEvent)
        {
            if(event.getParser().fragmentNumber === 0)
            {
                GetNitroInstance().soundManager.musicController?.requestUserSongDisks();
            }
        }
        else
        {
            GetNitroInstance().soundManager.musicController?.requestUserSongDisks();
        }
    }

    useMessageEvent(FurnitureListEvent, onFurniListUpdated);
    useMessageEvent(FurnitureListRemovedEvent, onFurniListUpdated);
    useMessageEvent(FurnitureListAddOrUpdateEvent, onFurniListUpdated);

    return { objectId, diskInventory, playlist, currentPlayingIndex, onClose, addToPlaylist, removeFromPlaylist, togglePlayPause };
}

export const useFurniturePlaylistEditorWidget = useFurniturePlaylistEditorWidgetState;
