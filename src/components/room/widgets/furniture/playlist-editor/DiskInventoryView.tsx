import { IAdvancedMap, MusicPriorities } from "@nitrots/nitro-renderer"
import { FC, MouseEvent, useCallback, useEffect, useState } from "react"
import { CatalogPageName, CreateLinkEvent, GetConfiguration, GetDiskColor, GetNitroInstance, LocalizeText } from "../../../../../api"
import { Base, Button, Flex, LayoutGridItem, Text } from "../../../../../common"

export interface DiskInventoryViewProps
{
    diskInventory: IAdvancedMap<number, number>;
    addToPlaylist: (diskId: number, slotNumber: number) => void;
}

export const DiskInventoryView: FC<DiskInventoryViewProps> = props =>
{
    const { diskInventory = null, addToPlaylist = null } = props
    const [ selectedItem, setSelectedItem ] = useState<number>(-1)
    const [ previewSongId, setPreviewSongId ] = useState<number>(-1)

    const previewSong = useCallback((event: MouseEvent, songId: number) =>
    {
        event.stopPropagation()

        setPreviewSongId(prevValue => (prevValue === songId) ? -1 : songId)
    }, [])

    const addSong = useCallback((event: MouseEvent, diskId: number) =>
    {
        event.stopPropagation()

        addToPlaylist(diskId, GetNitroInstance().soundManager.musicController?.getRoomItemPlaylist()?.length)
    }, [ addToPlaylist ])

    const openCatalogPage = () =>
    {
        CreateLinkEvent("catalog/open/" + CatalogPageName.TRAX_SONGS)
    }

    useEffect(() =>
    {
        if(previewSongId === -1) return

        GetNitroInstance().soundManager.musicController?.playSong(previewSongId, MusicPriorities.PRIORITY_SONG_PLAY, 0, 0, 0, 0)

        return () =>
        {
            GetNitroInstance().soundManager.musicController?.stop(MusicPriorities.PRIORITY_SONG_PLAY)
        }
    }, [ previewSongId ])

    useEffect(() =>
    {
        return () => setPreviewSongId(-1)
    }, [])

    return (<>
        <div className="bg-success container mx-auto flex max-w-full justify-center rounded py-3 sm:px-4">
            <img src={ GetConfiguration("image.library.url") + "playlist/title_mymusic.gif" } className="my-music" />
            <h2 className="ms-4">{ LocalizeText("playlist.editor.my.music") }</h2>
        </div>
        <div className="h-100 mt-4 overflow-y-scroll py-2">
            <div>
                { diskInventory && diskInventory.getKeys().map((key, index) =>
                {
                    const diskId = diskInventory.getKey(index)
                    const songId = diskInventory.getWithIndex(index)
                    const songInfo = GetNitroInstance().soundManager.musicController?.getSongInfo(songId)

                    return (
                        <LayoutGridItem key={ index } itemActive={ (selectedItem === index) } onClick={ () => setSelectedItem(prev => prev === index ? -1 : index) } classNames={ [ "text-black" ] }>
                            <div className="disk-image mb-n2" style={ { backgroundColor: GetDiskColor(songInfo?.songData) } }>
                            </div>
                            <Text truncate fullWidth className="text-center">{ songInfo?.name }</Text>
                            { (selectedItem === index) &&
                                    <Flex position="absolute" className="bg-secondary bottom-0 mb-1 rounded p-1" alignItems="center" justifyContent="center" gap={ 2 }>
                                        <Button onClick={ event => previewSong(event, songId) } variant="light">
                                            <Base className={ (previewSongId === songId) ? "pause-btn" : "preview-song" }/>
                                        </Button>
                                        <Button onClick={ event => addSong(event, diskId) } variant="light">
                                            <Base className="move-disk"/>
                                        </Button>
                                    </Flex>
                            }
                        </LayoutGridItem>)
                }) }
            </div>
        </div>
        <div className="playlist-bottom p-1">
            <h5>{ LocalizeText("playlist.editor.text.get.more.music") }</h5>
            <div>{ LocalizeText("playlist.editor.text.you.have.no.songdisks.available") }</div>
            <div>{ LocalizeText("playlist.editor.text.you.can.buy.some.from.the.catalogue") }</div>
            <button className="btn btn-primary btn-sm" onClick={ () => openCatalogPage() }>{ LocalizeText("playlist.editor.button.open.catalogue") }</button>
        </div>
        <img src={ GetConfiguration("image.library.url") + "playlist/background_get_more_music.gif" } className="get-more" />
    </>)
}
