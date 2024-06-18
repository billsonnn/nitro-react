import { GetSessionDataManager } from '@nitrots/nitro-renderer';
import { FC, useEffect, useState } from 'react';
import { LocalizeText, WIRED_STRING_DELIMETER, WiredFurniType } from '../../../../api';
import { Button, LayoutAvatarImageView, Text } from '../../../../common';
import { useWired } from '../../../../hooks';
import { NitroInput } from '../../../../layout';
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
        <WiredActionBaseView hasSpecialInput={ true } requiresFurni={ WiredFurniType.STUFF_SELECTION_OPTION_NONE } save={ save }>
            <div className="flex flex-col gap-1">
                <Text bold>{ LocalizeText('wiredfurni.params.bot.name') }</Text>
                <NitroInput maxLength={ 32 } type="text" value={ botName } onChange={ event => setBotName(event.target.value) } />
            </div>
            <div className="flex items-center justify-center">
                <LayoutAvatarImageView direction={ 4 } figure={ figure } />
                <Button onClick={ event => setFigure(GetSessionDataManager().figure) }>{ LocalizeText('wiredfurni.params.capture.figure') }</Button>
            </div>
        </WiredActionBaseView>
    );
};
