import { FC, useEffect, useState } from 'react';
import { LocalizeText, WiredFurniType } from '../../../../api';
import { Text } from '../../../../common';
import { useWired } from '../../../../hooks';
import { NitroInput } from '../../../../layout';
import { WiredTriggerBaseView } from './WiredTriggerBaseView';

export const WiredTriggerAvatarEnterRoomView: FC<{}> = props =>
{
    const [ username, setUsername ] = useState('');
    const [ avatarMode, setAvatarMode ] = useState(0);
    const { trigger = null, setStringParam = null } = useWired();

    const save = () => setStringParam((avatarMode === 1) ? username : '');

    useEffect(() =>
    {
        setUsername(trigger.stringData);
        setAvatarMode(trigger.stringData ? 1 : 0);
    }, [ trigger ]);

    return (
        <WiredTriggerBaseView hasSpecialInput={ true } requiresFurni={ WiredFurniType.STUFF_SELECTION_OPTION_NONE } save={ save }>
            <div className="flex flex-col gap-1">
                <Text bold>{ LocalizeText('wiredfurni.params.picktriggerer') }</Text>
                <div className="flex items-center gap-1">
                    <input checked={ (avatarMode === 0) } className="form-check-input" id="avatarMode0" name="avatarMode" type="radio" onChange={ event => setAvatarMode(0) } />
                    <Text>{ LocalizeText('wiredfurni.params.anyavatar') }</Text>
                </div>
                <div className="flex items-center gap-1">
                    <input checked={ (avatarMode === 1) } className="form-check-input" id="avatarMode1" name="avatarMode" type="radio" onChange={ event => setAvatarMode(1) } />
                    <Text>{ LocalizeText('wiredfurni.params.certainavatar') }</Text>
                </div>
                { (avatarMode === 1) &&
                    <NitroInput type="text" value={ username } onChange={ event => setUsername(event.target.value) } /> }
            </div>
        </WiredTriggerBaseView>
    );
};
