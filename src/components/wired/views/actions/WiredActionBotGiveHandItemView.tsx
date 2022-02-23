import { FC, useCallback, useEffect, useState } from 'react';
import { LocalizeText } from '../../../../api';
import { Column } from '../../../../common/Column';
import { Text } from '../../../../common/Text';
import { BatchUpdates } from '../../../../hooks';
import { WiredFurniType } from '../../common/WiredFurniType';
import { useWiredContext } from '../../context/WiredContext';
import { WiredActionBaseView } from './WiredActionBaseView';

const ALLOWED_HAND_ITEM_IDS: number[] = [ 2, 5, 7, 8, 9, 10, 27 ];

export const WiredActionBotGiveHandItemView: FC<{}> = props =>
{
    const [ botName, setBotName ] = useState('');
    const [ handItemId, setHandItemId ] = useState(-1);
    const { trigger = null, setStringParam = null, setIntParams = null } = useWiredContext();

    const save = useCallback(() =>
    {
        BatchUpdates(() =>
        {
            setStringParam(botName);
            setIntParams([ handItemId ]);
        });
    }, [ handItemId, botName, setStringParam, setIntParams ]);

    useEffect(() =>
    {
        BatchUpdates(() =>
        {
            setBotName(trigger.stringData);
            setHandItemId((trigger.intData.length > 0) ? trigger.intData[0] : 0);
        });
    }, [ trigger ]);

    return (
        <WiredActionBaseView requiresFurni={ WiredFurniType.STUFF_SELECTION_OPTION_NONE } save={ save }>
            <Column gap={ 1 }>
                <Text bold>{ LocalizeText('wiredfurni.params.bot.name') }</Text>
                <input type="text" className="form-control form-control-sm" maxLength={ 32 } value={ botName } onChange={ event => setBotName(event.target.value) } />
            </Column>
            <Column gap={ 1 }>
                <Text bold>{ LocalizeText('wiredfurni.params.handitem') }</Text>
                <select className="form-select form-select-sm" value={ handItemId } onChange={ event => setHandItemId(parseInt(event.target.value)) }>
                    <option value="0">------</option>
                    { ALLOWED_HAND_ITEM_IDS.map(value =>
                        {
                            return <option key={ value } value={ value }>{ LocalizeText(`handitem${ value }`) }</option>
                        }) }
                </select>
            </Column>
        </WiredActionBaseView>
    );
}
