import { FC } from 'react';
import { LocalizeText } from '../../../../../api';
import { NitroCardContentView, NitroCardHeaderView, NitroCardView } from '../../../../../common';
import { useFurniturePlaylistEditorWidget } from '../../../../../hooks';
import { DiskInventoryView } from './DiskInventoryView';
import { SongPlaylistView } from './SongPlaylistView';

export const FurniturePlaylistEditorWidgetView: FC<{}> = props =>
{
    const { objectId = -1, currentPlayingIndex = -1, playlist = null, diskInventory = null, onClose = null, togglePlayPause = null, removeFromPlaylist = null, addToPlaylist = null } = useFurniturePlaylistEditorWidget();

    if(objectId === -1) return null;

    return (
        <NitroCardView className="nitro-playlist-editor-widget" theme="primary-slim">
            <NitroCardHeaderView headerText={ LocalizeText('playlist.editor.title') } onCloseClick={ onClose } />
            <NitroCardContentView>
                <div className="d-flex flex-row gap-1 h-100">
                    <div className="w-50 position-relative overflow-hidden h-100 rounded d-flex flex-column">
                        <DiskInventoryView addToPlaylist={ addToPlaylist } diskInventory={ diskInventory } />
                    </div>
                    <div className="w-50 position-relative overflow-hidden h-100 rounded d-flex flex-column">
                        <SongPlaylistView furniId={ objectId } removeFromPlaylist={ removeFromPlaylist } playlist={ playlist } togglePlayPause={ togglePlayPause } currentPlayingIndex={ currentPlayingIndex }/>
                    </div>
                </div>
            </NitroCardContentView>
        </NitroCardView>
    );
}
