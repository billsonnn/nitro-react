import { UpdateRoomFilterMessageComposer } from '@nitrots/nitro-renderer';
import { FC, useState } from 'react';
import { LocalizeText, SendMessageComposer } from '../../../../api';
import { Button, classNames, Column, Flex, Grid, NitroCardContentView, NitroCardHeaderView, NitroCardView, Text } from '../../../../common';
import { useFilterWordsWidget, useNavigator } from '../../../../hooks';

export const RoomFilterWordsWidgetView: FC<{}> = props =>
{
    const [ word, setWord ] = useState<string>('bobba');
    const [ selectedWord, setSelectedWord ] = useState<string>('');
    const [ isSelectingWord, setIsSelectingWord ] = useState<boolean>(false);
    const { wordsFilter = [], isVisible = null, setWordsFilter, onClose = null } = useFilterWordsWidget();
    const { navigatorData = null } = useNavigator();

    const processAction = (isAddingWord: boolean) =>
    {
        if ((isSelectingWord) ? (!selectedWord) : (!word)) return;

        SendMessageComposer(new UpdateRoomFilterMessageComposer(navigatorData.enteredGuestRoom.roomId, isAddingWord, (isSelectingWord ? selectedWord : word)));
        setSelectedWord('');
        setWord('bobba');
        setIsSelectingWord(false);

        if (isAddingWord && wordsFilter.includes((isSelectingWord ? selectedWord : word))) return;

        setWordsFilter(prevValue =>
        {
            const newWords = [ ...prevValue ];

            isAddingWord ? newWords.push((isSelectingWord ? selectedWord : word)) : newWords.splice(newWords.indexOf((isSelectingWord ? selectedWord : word)), 1);

            return newWords;
        });
    }

    const onTyping = (word: string) =>
    {
        setWord(word);
        setIsSelectingWord(false);
    }

    const onSelectedWord = (word: string) =>
    {
        setSelectedWord(word);
        setIsSelectingWord(true);
    }

    if (!isVisible) return null;

    return (
        <NitroCardView className="nitro-guide-tool no-resize" theme="primary-slim">
            <NitroCardHeaderView headerText={ LocalizeText('navigator.roomsettings.roomfilter') } onCloseClick={ () => onClose() } />
            <NitroCardContentView className="text-black">
                <Grid className="d-flex align-items-center justify-content-end gap-2">
                    <input type="text" className="form-control form-control-sm" maxLength={ 255 } value={ word } onChange={ event => onTyping(event.target.value) } />
                    <Button onClick={ () => processAction(true) }>{ LocalizeText('navigator.roomsettings.roomfilter.addword') }</Button>
                </Grid>
                <Column overflow="auto" gap={ 0 } className="form-control form-control-sm" style={ { height: '100px' } }>
                    { wordsFilter && (wordsFilter.length > 0) && wordsFilter.map((word, index) =>
                    {
                        return (
                            <Flex key={ index } alignItems="center" className={ classNames('rounded p-1', (selectedWord === word) && 'bg-muted') } pointer onClick={ event => onSelectedWord(word) }>
                                <Text truncate>{ word }</Text>
                            </Flex>
                        )
                    }) }
                </Column>
                <Grid className="d-flex align-items-center justify-content-end gap-2">
                    <Button variant="danger" onClick={ () => processAction(false) } disabled={ wordsFilter.length === 0 || !isSelectingWord }>{ LocalizeText('navigator.roomsettings.roomfilter.removeword') }</Button>
                </Grid>
            </NitroCardContentView>
        </NitroCardView>
    );
};
