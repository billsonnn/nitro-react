import { FC } from "react"
import { useFurniturePlaylistEditorWidget } from "../../../../../hooks"

export const FurniturePlaylistEditorWidgetView: FC<{}> = props =>
{
    const { objectId = -1, currentPlayingIndex = -1, playlist = null, diskInventory = null, onClose = null, togglePlayPause = null, removeFromPlaylist = null, addToPlaylist = null } = useFurniturePlaylistEditorWidget()

    if(objectId === -1) return null

    return null
}
