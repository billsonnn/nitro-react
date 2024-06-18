import { FC, useEffect, useState } from 'react';
import { LocalizeText, WiredFurniType } from '../../../../api';
import { Text } from '../../../../common';
import { useWired } from '../../../../hooks';
import { NitroInput } from '../../../../layout';
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
        <WiredConditionBaseView hasSpecialInput={ true } requiresFurni={ WiredFurniType.STUFF_SELECTION_OPTION_NONE } save={ save }>
            <div className="flex flex-col gap-1">
                <Text bold>{ LocalizeText('wiredfurni.params.badgecode') }</Text>
                <NitroInput type="text" value={ badge } onChange={ event => setBadge(event.target.value) } />
            </div>
        </WiredConditionBaseView>
    );
};
