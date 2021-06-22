import { FC } from 'react';
import { NitroCardContentView, NitroCardView } from '../../../../layout';
import { NitroCardSimpleHeaderView } from '../../../../layout/card/simple-header';
import { LocalizeText } from '../../../../utils/LocalizeText';
import { MOTDViewProps } from './MOTDView.types';

export const MOTDView: FC<MOTDViewProps> = props =>
{
    const { notification = null, onCloseClick = null } = props;
    
    if(!notification) return null;

    return (
        <NitroCardView className="nitro-notification">
            <NitroCardSimpleHeaderView headerText={ LocalizeText('mod.alert.title') } onCloseClick={ onCloseClick } />
            <NitroCardContentView>
                <div className="text-black">
                    { notification.messages.map((message, index) =>
                        {
                            return <div key={ index } dangerouslySetInnerHTML={ {__html: message } } />
                        }) }
                </div>
            </NitroCardContentView>
        </NitroCardView>
    );
};
