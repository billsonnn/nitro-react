import { CreateLinkEvent, GetSoundManager, IAdvancedMap, MusicPriorities } from '@nitrots/nitro-renderer';
import { FC, MouseEvent, useCallback, useEffect, useState } from 'react';
import { CatalogPageName, GetConfigurationValue, GetDiskColor, LocalizeText } from '../../../../../api';
import { AutoGrid, Button, Flex, LayoutGridItem, Text } from '../../../../../common';

export interface DiskInventoryViewProps
{
    diskInventory: IAdvancedMap<number, number>;
    addToPlaylist: (diskId: number, slotNumber: number) => void;
}

export const DiskInventoryView: FC<DiskInventoryViewProps> = props =>
{
    const { diskInventory = null, addToPlaylist = null } = props;
    const [ selectedItem, setSelectedItem ] = useState<number>(-1);
    const [ previewSongId, setPreviewSongId ] = useState<number>(-1);

    const previewSong = useCallback((event: MouseEvent, songId: number) =>
    {
        event.stopPropagation();

        setPreviewSongId(prevValue => (prevValue === songId) ? -1 : songId);
    }, []);

    const addSong = useCallback((event: MouseEvent, diskId: number) =>
    {
        event.stopPropagation();

        addToPlaylist(diskId, GetSoundManager().musicController?.getRoomItemPlaylist()?.length);
    }, [ addToPlaylist ]);

    const openCatalogPage = () =>
    {
        CreateLinkEvent('catalog/open/' + CatalogPageName.TRAX_SONGS);
    };

    useEffect(() =>
    {
        if(previewSongId === -1) return;

        GetSoundManager().musicController?.playSong(previewSongId, MusicPriorities.PRIORITY_SONG_PLAY, 0, 0, 0, 0);

        return () =>
        {
            GetSoundManager().musicController?.stop(MusicPriorities.PRIORITY_SONG_PLAY);
        };
    }, [ previewSongId ]);

    useEffect(() =>
    {
        return () => setPreviewSongId(-1);
    }, []);

    return (<>
        <div className="flex justify-center py-3 rounded bg-success container-fluid">
            <img className="my-music" src={ GetConfigurationValue('image.library.url') + 'playlist/title_mymusic.gif' } />
            <h2 className="ms-4">{ LocalizeText('playlist.editor.my.music') }</h2>
        </div>
        <div className="h-full py-2 mt-4 overflow-y-scroll">
            <AutoGrid columnCount={ 3 } columnMinWidth={ 95 } gap={ 1 }>
                { diskInventory && diskInventory.getKeys().map((key, index) =>
                {
                    const diskId = diskInventory.getKey(index);
                    const songId = diskInventory.getWithIndex(index);
                    const songInfo = GetSoundManager().musicController?.getSongInfo(songId);

                    return (
                        <LayoutGridItem key={ index } classNames={ [ 'text-black' ] } itemActive={ (selectedItem === index) } onClick={ () => setSelectedItem(prev => prev === index ? -1 : index) }>
                            <div className="flex-shrink-0 disk-image mb-n2" style={ { backgroundColor: GetDiskColor(songInfo?.songData) } }>
                            </div>
                            <Text fullWidth truncate className="text-center">{ songInfo?.name }</Text>
                            { (selectedItem === index) &&
                                <Flex alignItems="center" className="bottom-0 p-1 mb-1 rounded bg-secondary" gap={ 2 } justifyContent="center" position="absolute">
                                    <Button variant="light" onClick={ event => previewSong(event, songId) }>
                                        <div className={ (previewSongId === songId) ? 'pause-btn' : 'preview-song' } />
                                    </Button>
                                    <Button variant="light" onClick={ event => addSong(event, diskId) }>
                                        <div className="move-disk" />
                                    </Button>
                                </Flex>
                            }
                        </LayoutGridItem>);
                }) }
            </AutoGrid>
        </div>
        <div className="p-1 text-black playlist-bottom">
            <h5>{ LocalizeText('playlist.editor.text.get.more.music') }</h5>
            <div>{ LocalizeText('playlist.editor.text.you.have.no.songdisks.available') }</div>
            <div>{ LocalizeText('playlist.editor.text.you.can.buy.some.from.the.catalogue') }</div>
            <button className="btn btn-primary btn-sm" onClick={ () => openCatalogPage() }>{ LocalizeText('playlist.editor.button.open.catalogue') }</button>
        </div>
        <img className="get-more" src={ `${ GetConfigurationValue('image.library.url') }playlist/background_get_more_music.gif` } />
    </>);
};
