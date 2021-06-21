import classNames from 'classnames';
import { AuthenticationMessageComposer } from 'nitro-renderer';
import { AuthenticationEvent } from 'nitro-renderer/src/nitro/communication/messages/incoming/handshake/AuthenticationEvent';
import { FC, useCallback, useEffect, useState } from 'react';
import ReCAPTCHA from "react-google-recaptcha";
import { CreateMessageHook, SendMessageHook } from '../../hooks/messages';
import { GetConfiguration } from '../../utils/GetConfiguration';
import { AuthField, AuthViewProps } from './AuthView.types';
import { AuthFormView } from './views/form/AuthFormView';

export const AuthView: FC<AuthViewProps> = props =>
{
    const [ showLogin, setShowLogin ]                       = useState(true);
    const [ registerEnabled, setRegisterEnabled ]           = useState(false);
    const [ isLoading, setIsLoading ]                       = useState(false);
    const [ fields, setFields ]                             = useState<AuthField[]>(null);
    const [ recaptchaPublicKey, setRecaptchaPublicKey ]     = useState(null);
    const [ recaptchaAnswer, setRecaptchaAnswer ]           = useState(null);

    useEffect(() =>
    {
        const configFields = GetConfiguration<AuthField[]>('auth.system.' + (showLogin ? 'login' : 'register') + '.fields');
        
        if(configFields.length > 0) setFields(configFields);

        const recaptchaKey = GetConfiguration<string>('auth.system.recaptcha.public_key');

        if(recaptchaKey) setRecaptchaPublicKey(recaptchaKey);

        const registerEnabledConfig = GetConfiguration<boolean>('auth.system.register.enabled');

        if(registerEnabledConfig) setRegisterEnabled(true);
    }, [ showLogin ]);

    const setFieldValue = useCallback((key: string, value: string) =>
    {
        const fieldsClone = Array.from(fields);

        const field = fieldsClone.find(field => field.name === key);

        if(!field) return;

        field.value = value;

        setFields(fieldsClone);
    }, [ fields ]);

    const sendHttpAuthentication = useCallback((body: string) =>
    {
        const endpoint = (GetConfiguration('auth.system.http.endpoint.' + (showLogin ? 'login' : 'register')) as string);

        if(!endpoint) return;

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: body
        };

        fetch(endpoint, requestOptions)
            .then(response => response.json(), error =>
                {
                    setIsLoading(false);
                    console.log('Login failed', error);

                    return null;
                })
            .then(data => handleAuthentication(data));
    }, [ showLogin ]);

    const sendPacketAuthentication = useCallback((keys: string[], values: string[]) =>
    {
        SendMessageHook(new AuthenticationMessageComposer((showLogin ? 'login' : 'register'), keys, values));
    }, [ showLogin ]);

    CreateMessageHook(AuthenticationEvent, event => handleAuthentication(Object.entries(event.parser)));

    const handleAuthentication = useCallback((data: any) =>
    {
        setIsLoading(false);

        if(!data) return;

        let ssoFieldName = 'sso';

        if(GetConfiguration<boolean>('auth.system.http.enabled')) ssoFieldName = GetConfiguration<string>('auth.system.sso_field_name', 'sso');
        
        if(!data[ssoFieldName]) return;

        window.location.href = window.location.origin + '/?sso=' + data[ssoFieldName];
    }, []);

    const sendAuthentication = useCallback(() =>
    {
        const recaptchaFieldName = GetConfiguration<string>('auth.system.recaptcha.field_name');

        if(recaptchaPublicKey && (!recaptchaAnswer || !recaptchaFieldName)) return;
        
        let fieldsOk = true;

        const httpEnabled = GetConfiguration<boolean>('auth.system.http.enabled');

        const requestData               = {};
        const requestKeys: string[]     = [];
        const requestValues: string[]   = [];
        
        fields.map(field =>
            {
                if(!field.value || field.value.length === 0)
                {
                    fieldsOk = false;
                    return false;
                }

                if(httpEnabled)
                    requestData[field.name] = field.value;
                else
                {
                    requestKeys.push(field.name);
                    requestValues.push(field.value.toString());
                }
                return true;
            });

            
        if(!fieldsOk) return;

        if(recaptchaPublicKey) requestData[recaptchaFieldName] = recaptchaAnswer;

        setIsLoading(true);

        if(httpEnabled)
        {
            sendHttpAuthentication(JSON.stringify(requestData));
        }
        else
        {
            sendPacketAuthentication(requestKeys, requestValues);
        }
    }, [ fields, recaptchaPublicKey, recaptchaAnswer ]);

    const handleAction = useCallback((action: string, value?: string) =>
    {
        if(!action) return;

        switch(action)
        {
            case 'toggle_login':
                setShowLogin(value => !value);
                return;
            case 'recaptcha_load':
                setRecaptchaAnswer(value);
                return;
            case 'send':
                sendAuthentication();
                return;
        }
    }, [ fields, recaptchaAnswer ]);

    if(!fields) return null;

    return (
        <div className="nitro-auth d-flex flex-column justify-content-center align-items-center w-100 h-100">
            <div className="logo mb-4"></div>
            <AuthFormView fields={ fields } isLoading={ isLoading } setFieldValue={ setFieldValue } />
            { recaptchaPublicKey && <ReCAPTCHA sitekey={ recaptchaPublicKey }  onChange={ (event) => handleAction('recaptcha_load', event) } /> }
            <div className="d-flex justify-content-center mt-3">
                <button className="btn btn-success btn-lg me-2" disabled={ isLoading } onClick={ () => handleAction('send') }><i className={ 'fas ' + classNames({'fa-paper-plane': !isLoading, 'fa-spinner fa-spin': isLoading })}></i></button>
                { registerEnabled && <button className="btn btn-primary btn-lg" disabled={ isLoading } onClick={ () => handleAction('toggle_login') }><i className={'fas ' + classNames({'fa-user-plus': showLogin, 'fa-chevron-left': !showLogin})}></i></button> }
            </div>
        </div>
    );
}
