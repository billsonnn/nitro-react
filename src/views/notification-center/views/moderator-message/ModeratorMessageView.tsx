import { FC } from 'react';
import { NitroCardContentView, NitroCardView } from '../../../../layout';
import { NitroCardSimpleHeaderView } from '../../../../layout/card/simple-header';
import { LocalizeText } from '../../../../utils/LocalizeText';
import { ModeratorMessageViewProps } from './ModeratorMessageView.types';

export const ModeratorMessageView: FC<ModeratorMessageViewProps> = props =>
{
    const { notification = null, onCloseClick = null } = props;
    
    if(!notification) return null;

    return (
        <NitroCardView className="nitro-notification">
            <NitroCardSimpleHeaderView headerText={ LocalizeText('mod.alert.title') } onCloseClick={ onCloseClick } />
            <NitroCardContentView>
                <div className="text-black">
                    <div dangerouslySetInnerHTML={ {__html: notification.message } } />
                    <div className="fw-bold text-center">
                        <a href={ notification.link } rel="noreferrer" target="_blank" onClick={ onCloseClick }>{ LocalizeText('mod.alert.link') }</a>
                    </div>
                </div>
            </NitroCardContentView>
        </NitroCardView>
    );
};
