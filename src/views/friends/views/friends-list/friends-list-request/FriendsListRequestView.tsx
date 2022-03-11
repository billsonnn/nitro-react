import { FC } from 'react';
import { LocalizeText } from '../../../../../api';
import { Button, Column, Flex, NitroCardAccordionSetView, NitroCardAccordionSetViewProps } from '../../../../../common';
import { MessengerRequest } from '../../../common/MessengerRequest';
import { useFriendsContext } from '../../../FriendsContext';
import { FriendsListRequestItemView } from './FriendsListRequestItemView';

interface FriendsListRequestViewProps extends NitroCardAccordionSetViewProps
{
    requests: MessengerRequest[];
}

export const FriendsListRequestView: FC<FriendsListRequestViewProps> = props =>
{
    const { requests = [], children = null, ...rest } = props;
    const { declineFriend = null } = useFriendsContext();

    if(!requests.length) return null;

    return (
        <NitroCardAccordionSetView { ...rest }>
            <Column fullHeight justifyContent="between" gap={ 1 }>
                <Column gap={ 0 }>
                    { requests.map((request, index) => <FriendsListRequestItemView key={ index } request={ request } />) }
                </Column>
                <Flex justifyContent="center" className="px-2 py-1">
                    <Button onClick={ event => declineFriend(-1, true) }>
                        { LocalizeText('friendlist.requests.dismissall') }
                    </Button>
                </Flex>
            </Column>
            { children }
        </NitroCardAccordionSetView>
    );
}
