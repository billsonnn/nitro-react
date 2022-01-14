import { FC, useCallback, useEffect, useState } from 'react';
import { GetSessionDataManager, LocalizeText } from '../../../../api';
import { Button } from '../../../../common/Button';
import { Column } from '../../../../common/Column';
import { Flex } from '../../../../common/Flex';
import { Text } from '../../../../common/Text';
import { BatchUpdates } from '../../../../hooks';
import { AvatarImageView } from '../../../../views/shared/avatar-image/AvatarImageView';
import { WiredFurniType } from '../../common/WiredFurniType';
import { WIRED_STRING_DELIMETER } from '../../common/WiredStringDelimeter';
import { useWiredContext } from '../../context/WiredContext';
import { WiredActionBaseView } from './WiredActionBaseView';

const DEFAULT_FIGURE: string = 'hd-180-1.ch-210-66.lg-270-82.sh-290-81';

export const WiredActionBotChangeFigureView: FC<{}> = props =>
{
    const [ botName, setBotName ] = useState('');
    const [ figure, setFigure ] = useState('');
    const { trigger = null, setStringParam = null } = useWiredContext();

    const copyLooks = useCallback(() =>
    {
        setFigure(GetSessionDataManager().figure);
    }, []);

    const save = useCallback(() =>
    {
        setStringParam((botName + WIRED_STRING_DELIMETER + figure));
    }, [ botName, figure, setStringParam ]);

    useEffect(() =>
    {
        const data = trigger.stringData.split(WIRED_STRING_DELIMETER);

        BatchUpdates(() =>
        {
            if(data.length > 0) setBotName(data[0]);
            if(data.length > 1) setFigure(data[1].length > 0 ? data[1] : DEFAULT_FIGURE);
        });
    }, [ trigger ]);

    return (
        <WiredActionBaseView requiresFurni={ WiredFurniType.STUFF_SELECTION_OPTION_NONE } save={ save }>
            <Column gap={ 1 }>
                <Text bold>{ LocalizeText('wiredfurni.params.bot.name') }</Text>
                <input type="text" className="form-control form-control-sm" maxLength={ 32 } value={ botName } onChange={ event => setBotName(event.target.value) } />
            </Column>
            <Flex center>
                <AvatarImageView figure={ figure } direction={ 4 } />
                <Button onClick={ copyLooks }>{ LocalizeText('wiredfurni.params.capture.figure') }</Button>
            </Flex>
        </WiredActionBaseView>
    );
}
