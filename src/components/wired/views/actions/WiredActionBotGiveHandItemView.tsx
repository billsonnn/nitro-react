import { FC, useEffect, useState } from 'react';
import { LocalizeText, WiredFurniType } from '../../../../api';
import { Column, Text } from '../../../../common';
import { useWired } from '../../../../hooks';
import { WiredActionBaseView } from './WiredActionBaseView';

const ALLOWED_HAND_ITEM_IDS: number[] = [ 2, 5, 7, 8, 9, 10, 27 ];

export const WiredActionBotGiveHandItemView: FC<{}> = props =>
{
    const [ botName, setBotName ] = useState('');
    const [ handItemId, setHandItemId ] = useState(-1);
    const { trigger = null, setStringParam = null, setIntParams = null } = useWired();

    const save = () =>
    {
        setStringParam(botName);
        setIntParams([ handItemId ]);
    }

    useEffect(() =>
    {
        setBotName(trigger.stringData);
        setHandItemId((trigger.intData.length > 0) ? trigger.intData[0] : 0);
    }, [ trigger ]);

    return (
        <WiredActionBaseView requiresFurni={ WiredFurniType.STUFF_SELECTION_OPTION_NONE } hasSpecialInput={ true } save={ save }>
            <Column gap={ 1 }>
                <Text bold>{ LocalizeText('wiredfurni.params.bot.name') }</Text>
                <input type="text" className="form-control form-control-sm" maxLength={ 32 } value={ botName } onChange={ event => setBotName(event.target.value) } />
            </Column>
            <Column gap={ 1 }>
                <Text bold>{ LocalizeText('wiredfurni.params.handitem') }</Text>
                <select className="form-select form-select-sm" value={ handItemId } onChange={ event => setHandItemId(parseInt(event.target.value)) }>
                    <option value="0">------</option>
                    { ALLOWED_HAND_ITEM_IDS.map(value => <option key={ value } value={ value }>{ LocalizeText(`handitem${ value }`) }</option>) }
                </select>
            </Column>
        </WiredActionBaseView>
    );
}
