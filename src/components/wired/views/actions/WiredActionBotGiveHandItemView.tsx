import { FC, useEffect, useState } from 'react';
import { LocalizeText, WiredFurniType } from '../../../../api';
import { Text } from '../../../../common';
import { useWired } from '../../../../hooks';
import { NitroInput } from '../../../../layout';
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
    };

    useEffect(() =>
    {
        setBotName(trigger.stringData);
        setHandItemId((trigger.intData.length > 0) ? trigger.intData[0] : 0);
    }, [ trigger ]);

    return (
        <WiredActionBaseView hasSpecialInput={ true } requiresFurni={ WiredFurniType.STUFF_SELECTION_OPTION_NONE } save={ save }>
            <div className="flex flex-col gap-1">
                <Text bold>{ LocalizeText('wiredfurni.params.bot.name') }</Text>
                <NitroInput maxLength={ 32 } type="text" value={ botName } onChange={ event => setBotName(event.target.value) } />
            </div>
            <div className="flex flex-col gap-1">
                <Text bold>{ LocalizeText('wiredfurni.params.handitem') }</Text>
                <select className="form-select form-select-sm" value={ handItemId } onChange={ event => setHandItemId(parseInt(event.target.value)) }>
                    <option value="0">------</option>
                    { ALLOWED_HAND_ITEM_IDS.map(value => <option key={ value } value={ value }>{ LocalizeText(`handitem${ value }`) }</option>) }
                </select>
            </div>
        </WiredActionBaseView>
    );
};
