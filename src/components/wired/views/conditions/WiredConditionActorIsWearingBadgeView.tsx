import { FC, useCallback, useEffect, useState } from 'react';
import { LocalizeText } from '../../../../api';
import { Column } from '../../../../common/Column';
import { Text } from '../../../../common/Text';
import { WiredFurniType } from '../../common/WiredFurniType';
import { useWiredContext } from '../../context/WiredContext';
import { WiredConditionBaseView } from './WiredConditionBaseView';

export const WiredConditionActorIsWearingBadgeView: FC<{}> = props =>
{
    const [ badge, setBadge ] = useState('');
    const { trigger = null, setStringParam = null } = useWiredContext();

    const save = useCallback(() =>
    {
        setStringParam(badge);
    }, [ badge, setStringParam ]);

    useEffect(() =>
    {
        setBadge(trigger.stringData);
    }, [ trigger ]);
    
    return (
        <WiredConditionBaseView requiresFurni={ WiredFurniType.STUFF_SELECTION_OPTION_NONE } save={ save }>
            <Column gap={ 1 }>
                <Text bold>{ LocalizeText('wiredfurni.params.badgecode') }</Text>
                <input type="text" className="form-control form-control-sm" value={ badge } onChange={ event => setBadge(event.target.value) } />
            </Column>
        </WiredConditionBaseView>
    );
}
