import { FC, useEffect, useState } from 'react';
import { LocalizeText, WiredFurniType } from '../../../../api';
import { Column, Text } from '../../../../common';
import { useWired } from '../../../../hooks';
import { WiredConditionBaseView } from './WiredConditionBaseView';

export const WiredConditionActorIsWearingBadgeView: FC<{}> = props =>
{
    const [ badge, setBadge ] = useState('');
    const { trigger = null, setStringParam = null } = useWired();

    const save = () => setStringParam(badge);

    useEffect(() =>
    {
        setBadge(trigger.stringData);
    }, [ trigger ]);
    
    return (
        <WiredConditionBaseView requiresFurni={ WiredFurniType.STUFF_SELECTION_OPTION_NONE } hasSpecialInput={ true } save={ save }>
            <Column gap={ 1 }>
                <Text bold>{ LocalizeText('wiredfurni.params.badgecode') }</Text>
                <input type="text" className="form-control form-control-sm" value={ badge } onChange={ event => setBadge(event.target.value) } />
            </Column>
        </WiredConditionBaseView>
    );
}
