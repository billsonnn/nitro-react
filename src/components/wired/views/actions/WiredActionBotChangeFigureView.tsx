import { GetSessionDataManager } from '@nitrots/nitro-renderer';
import { FC, useEffect, useState } from 'react';
import { LocalizeText, WIRED_STRING_DELIMETER, WiredFurniType } from '../../../../api';
import { Button, Column, Flex, LayoutAvatarImageView, Text } from '../../../../common';
import { useWired } from '../../../../hooks';
import { WiredActionBaseView } from './WiredActionBaseView';

const DEFAULT_FIGURE: string = 'hd-180-1.ch-210-66.lg-270-82.sh-290-81';

export const WiredActionBotChangeFigureView: FC<{}> = props =>
{
    const [ botName, setBotName ] = useState('');
    const [ figure, setFigure ] = useState('');
    const { trigger = null, setStringParam = null } = useWired();

    const save = () => setStringParam((botName + WIRED_STRING_DELIMETER + figure));

    useEffect(() =>
    {
        const data = trigger.stringData.split(WIRED_STRING_DELIMETER);

        if(data.length > 0) setBotName(data[0]);
        if(data.length > 1) setFigure(data[1].length > 0 ? data[1] : DEFAULT_FIGURE);
    }, [ trigger ]);

    return (
        <WiredActionBaseView requiresFurni={ WiredFurniType.STUFF_SELECTION_OPTION_NONE } hasSpecialInput={ true } save={ save }>
            <Column gap={ 1 }>
                <Text bold>{ LocalizeText('wiredfurni.params.bot.name') }</Text>
                <input type="text" className="form-control form-control-sm" maxLength={ 32 } value={ botName } onChange={ event => setBotName(event.target.value) } />
            </Column>
            <Flex center>
                <LayoutAvatarImageView figure={ figure } direction={ 4 } />
                <Button onClick={ event => setFigure(GetSessionDataManager().figure) }>{ LocalizeText('wiredfurni.params.capture.figure') }</Button>
            </Flex>
        </WiredActionBaseView>
    );
}
