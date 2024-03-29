import { ISongInfo } from '@nitrots/nitro-renderer';
import { FC, useState } from 'react';
import { GetConfigurationValue, GetDiskColor, LocalizeText } from '../../../../../api';
import { Base, Button, Flex, Text } from '../../../../../common';

export interface SongPlaylistViewProps
{
    furniId: number;
    playlist: ISongInfo[];
    currentPlayingIndex: number;
    removeFromPlaylist(slotNumber: number): void;
    togglePlayPause(furniId: number, position: number): void;
}

export const SongPlaylistView: FC<SongPlaylistViewProps> = props =>
{
    const { furniId = -1, playlist = null, currentPlayingIndex = -1, removeFromPlaylist = null, togglePlayPause = null } = props;
    const [ selectedItem, setSelectedItem ] = useState<number>(-1);

    const action = (index: number) =>
    {
        if(selectedItem === index) removeFromPlaylist(index);
    }

    const playPause = (furniId: number, selectedItem: number) =>
    {
        togglePlayPause(furniId, selectedItem !== -1 ? selectedItem : 0 )
    }

    return (<>
        <div className="bg-primary py-3 container-fluid justify-content-center d-flex rounded">
            <img src={ GetConfigurationValue('image.library.url') + 'playlist/title_playlist.gif' } className="playlist-img" />
            <h2 className="ms-4">{ LocalizeText('playlist.editor.playlist') }</h2>
        </div>
        <div className="h-100 overflow-y-scroll py-2">
            <Flex column gap={ 2 }>
                { playlist && playlist.map( (songInfo, index) =>
                {
                    return <Flex gap={ 1 } key={ index } className={ 'text-black cursor-pointer ' + (selectedItem === index ? 'border border-muted border-2 rounded' : 'border-2') } alignItems="center" onClick={ () => setSelectedItem(prev => prev === index ? -1 : index) }>
                        <Base onClick={ () => action(index) } className={ 'disk-2 ' + (selectedItem === index ? 'selected-song' : '') } style={ { backgroundColor: (selectedItem === index ? '' : GetDiskColor(songInfo.songData)) } }/>
                        { songInfo.name }
                    </Flex>
                }) }

            </Flex>
        </div>
        { (!playlist || playlist.length === 0 ) &&
        <><div className="playlist-bottom text-black p-1 ms-5">
            <h5>{ LocalizeText('playlist.editor.add.songs.to.your.playlist') }</h5>
            <div>{ LocalizeText('playlist.editor.text.click.song.to.choose.click.again.to.move') }</div>
        </div>
        <img src={ GetConfigurationValue('image.library.url') + 'playlist/background_add_songs.gif' } className="add-songs" /></>
        }
        { (playlist && playlist.length > 0) &&
            <>
                { (currentPlayingIndex === -1) &&
                <Button variant="success" size="lg" onClick={ () => playPause(furniId, selectedItem) }>
                    { LocalizeText('playlist.editor.button.play.now') }
                </Button>
                }
                { (currentPlayingIndex !== -1) &&
                    <Flex gap={ 1 }>
                        <Button variant="danger" onClick={ () => playPause(furniId, selectedItem) }>
                            <Base className="pause-song"/>
                        </Button>
                        <Flex column>
                            <Text bold display="block">{ LocalizeText('playlist.editor.text.now.playing.in.your.room') }</Text>
                            <Text>
                                { playlist[currentPlayingIndex]?.name + ' - ' + playlist[currentPlayingIndex]?.creator }
                            </Text>
                        </Flex>

                    </Flex>
                }
            </>
        }

    </>);
}
