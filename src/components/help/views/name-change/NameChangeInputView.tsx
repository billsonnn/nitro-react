import { CheckUserNameMessageComposer, CheckUserNameResultMessageEvent } from '@nitrots/nitro-renderer';
import { FC, useCallback, useState } from 'react';
import { LocalizeText } from '../../../../api';
import { CreateMessageHook, SendMessageHook } from '../../../../hooks';
import { NameChangeLayoutViewProps } from './NameChangeView.types';

const AVAILABLE: number = 0;
const TOO_SHORT: number = 2;
const TOO_LONG: number = 3;
const NOT_VALID: number = 4;
const TAKEN_WITH_SUGGESTIONS: number = 5;
const DISABLED: number = 6;

export const NameChangeInputView:FC<NameChangeLayoutViewProps> = props =>
{
    const { onAction = null } = props;

    const [ newUsername, setNewUsername ] = useState<string>('');
    const [ canProceed, setCanProceed ] = useState<boolean>(false);
    const [ isChecking, setIsChecking ] = useState<boolean>(false);
    const [ errorCode, setErrorCode ] = useState<string>(null);
    const [ suggestions, setSuggestions ] = useState<string[]>([]);

    const onCheckUserNameResultMessageEvent = useCallback((event: CheckUserNameResultMessageEvent) =>
    {
        setIsChecking(false);

        const parser = event.getParser();

        if(!parser) return;

        switch(parser.resultCode)
        {
            case AVAILABLE:
                setCanProceed(true);
                break;
            case TOO_SHORT:
                setErrorCode('short');
                break;
            case TOO_LONG:
                setErrorCode('long');
                break;
            case NOT_VALID:
                setErrorCode('invalid');
                break;
            case TAKEN_WITH_SUGGESTIONS:
                setSuggestions(parser.nameSuggestions);
                setErrorCode('taken');
                break;
            case DISABLED:
                setErrorCode('change_not_allowed');
        }
    }, []);
    
    CreateMessageHook(CheckUserNameResultMessageEvent, onCheckUserNameResultMessageEvent);

    const check = useCallback(() =>
    {
        if(newUsername === '') return;

        setCanProceed(false);
        setSuggestions([]);
        setErrorCode(null);

        setIsChecking(true);
        SendMessageHook(new CheckUserNameMessageComposer(newUsername));
    }, [ newUsername ]);

    const handleUsernameChange = useCallback((username: string) =>
    {
        setCanProceed(false);
        setSuggestions([]);
        setErrorCode(null);
        
        setNewUsername(username);
    }, []);

    return (
        <div className="d-flex flex-column gap-3 h-100">
            <div>{ LocalizeText('tutorial.name_change.info.select') }</div>
            <div className="d-flex gap-2">
                <input type="text" className="form-control form-control-sm" value={newUsername} onChange={ (e) => handleUsernameChange(e.target.value) } />
                <button className="btn btn-primary" disabled={ newUsername === '' || isChecking } onClick={ check }>{ LocalizeText('tutorial.name_change.check') }</button>
            </div>
            { !errorCode && !canProceed && <div className="bg-muted rounded p-2 text-center">{ LocalizeText('help.tutorial.name.info') }</div> }
            { errorCode && <div className="bg-danger rounded p-2 text-center text-white">{ LocalizeText(`help.tutorial.name.${errorCode}`, ['name'], [newUsername]) }</div> }
            { canProceed && <div className="bg-success rounded p-2 text-center text-white">{ LocalizeText('help.tutorial.name.available', ['name'], [newUsername]) }</div> }
            { suggestions && <div className="d-flex flex-column gap-2">
                {
                    suggestions.map((suggestion, i) => 
                    {
                        return (<div key={ i } className="col bg-muted rounded p-1 cursor-pointer" onClick={ () => handleUsernameChange(suggestion) }>{ suggestion }</div>);
                    })
                }
            </div> }
            <div className="d-flex gap-2">
                <button className="btn btn-success w-100" disabled={ !canProceed } onClick={ () => onAction('confirmation', newUsername) }>{ LocalizeText('tutorial.name_change.pick') }</button>
                <button className="btn btn-primary w-100" onClick={ () => onAction('close') }>{ LocalizeText('cancel') }</button>
            </div>
        </div>
    );
}
