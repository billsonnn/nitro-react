import { GetSessionDataManager } from '@nitrots/nitro-renderer';
import { FC, useEffect, useState } from 'react';
import { LocalizeText, WiredFurniType } from '../../../../api';
import { Text } from '../../../../common';
import { useWired } from '../../../../hooks';
import { NitroInput } from '../../../../layout';
import { WiredTriggerBaseView } from './WiredTriggerBaseView';

export const WiredTriggerAvatarSaysSomethingView: FC<{}> = props =>
{
    const [ message, setMessage ] = useState('');
    const [ triggererAvatar, setTriggererAvatar ] = useState(-1);
    const { trigger = null, setStringParam = null, setIntParams = null } = useWired();

    const save = () =>
    {
        setStringParam(message);
        setIntParams([ triggererAvatar ]);
    };

    useEffect(() =>
    {
        setMessage(trigger.stringData);
        setTriggererAvatar((trigger.intData.length > 0) ? trigger.intData[0] : 0);
    }, [ trigger ]);

    return (
        <WiredTriggerBaseView hasSpecialInput={ true } requiresFurni={ WiredFurniType.STUFF_SELECTION_OPTION_NONE } save={ save }>
            <div className="flex flex-col gap-1">
                <Text bold>{ LocalizeText('wiredfurni.params.whatissaid') }</Text>
                <NitroInput type="text" value={ message } onChange={ event => setMessage(event.target.value) } />
            </div>
            <div className="flex flex-col gap-1">
                <Text bold>{ LocalizeText('wiredfurni.params.picktriggerer') }</Text>
                <div className="flex items-center gap-1">
                    <input checked={ (triggererAvatar === 0) } className="form-check-input" id="triggererAvatar0" name="triggererAvatar" type="radio" onChange={ event => setTriggererAvatar(0) } />
                    <Text>{ LocalizeText('wiredfurni.params.anyavatar') }</Text>
                </div>
                <div className="flex items-center gap-1">
                    <input checked={ (triggererAvatar === 1) } className="form-check-input" id="triggererAvatar1" name="triggererAvatar" type="radio" onChange={ event => setTriggererAvatar(1) } />
                    <Text>{ GetSessionDataManager().userName }</Text>
                </div>
            </div>
        </WiredTriggerBaseView>
    );
};
