import { FC } from 'react';
import { NitroCardContentView, NitroCardView } from '../../../../layout';
import { NitroCardSimpleHeaderView } from '../../../../layout/card/simple-header';
import { LocalizeText } from '../../../../utils/LocalizeText';
import { BroadcastMessageViewProps } from './BroadcastMessageView.types';

export const BroadcastMessageView: FC<BroadcastMessageViewProps> = props =>
{
    const { notification = null, onCloseClick = null } = props;
    
    if(!notification) return null;

    return (
        <NitroCardView className="nitro-notification">
            <NitroCardSimpleHeaderView headerText={ LocalizeText('mod.alert.title') } onCloseClick={ onCloseClick } />
            <NitroCardContentView>
                <div className="text-black">
                    <div dangerouslySetInnerHTML={ {__html: notification.message } } />
                </div>
            </NitroCardContentView>
        </NitroCardView>
    );
};
