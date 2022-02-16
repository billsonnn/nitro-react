import { FC, useCallback, useEffect, useState } from 'react';
import { LocalizeText } from '../../../../api';
import { Column } from '../../../../common/Column';
import { Text } from '../../../../common/Text';
import { WiredFurniType } from '../../common/WiredFurniType';
import { useWiredContext } from '../../context/WiredContext';
import { WiredActionBaseView } from './WiredActionBaseView';

export const WiredActionKickFromRoomView: FC<{}> = props =>
{
    const [ message, setMessage ] = useState('');
    const { trigger = null, setStringParam = null } = useWiredContext();

    const save = useCallback(() =>
    {
        setStringParam(message);
    }, [ message, setStringParam ]);

    useEffect(() =>
    {
        setMessage(trigger.stringData);
    }, [ trigger ]);

    return (
        <WiredActionBaseView requiresFurni={ WiredFurniType.STUFF_SELECTION_OPTION_NONE } save={ save }>
            <Column gap={ 1 }>
                <Text bold>{ LocalizeText('wiredfurni.params.message') }</Text>
                <input type="text" className="form-control form-control-sm" value={ message } onChange={ event => setMessage(event.target.value) } maxLength={ 100 } />
            </Column>
        </WiredActionBaseView>
    );
}
