import { FC } from 'react';
import { LocalizeText } from '../../../../../api';
import { Button, Column, NitroCardAccordionSetView, NitroCardAccordionSetViewProps } from '../../../../../common';
import { useFriends } from '../../../../../hooks';
import { FriendsListRequestItemView } from './FriendsListRequestItemView';

export const FriendsListRequestView: FC<NitroCardAccordionSetViewProps> = props =>
{
    const { children = null, ...rest } = props;
    const { requests = [], requestResponse = null } = useFriends();

    if(!requests.length) return null;

    return (
        <NitroCardAccordionSetView { ...rest }>
            <Column fullHeight gap={ 1 } justifyContent="between">
                <Column gap={ 0 }>
                    { requests.map((request, index) => <FriendsListRequestItemView key={ index } request={ request } />) }
                </Column>
                <div className="flex justify-center px-2 py-1">
                    <Button onClick={ event => requestResponse(-1, false) }>
                        { LocalizeText('friendlist.requests.dismissall') }
                    </Button>
                </div>
            </Column>
            { children }
        </NitroCardAccordionSetView>
    );
};
