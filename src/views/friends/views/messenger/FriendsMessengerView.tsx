import { FC } from 'react';
import { LocalizeText } from '../../../../api';
import { NitroCardContentView, NitroCardHeaderView, NitroCardView } from '../../../../layout';

export const FriendsMessengerView: FC<{}> = props =>
{
    return (<NitroCardView className="nitro-friends-messenger" simple={ true }>
                <NitroCardHeaderView headerText={ LocalizeText('friendlist.friends') } onCloseClick={ () => {} } />
                <NitroCardContentView className="p-0">
                    
                </NitroCardContentView>
            </NitroCardView>);
};
