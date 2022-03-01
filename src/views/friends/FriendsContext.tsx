import { createContext, FC, ProviderProps, useContext } from 'react';
import { MessengerFriend } from './common/MessengerFriend';
import { MessengerRequest } from './common/MessengerRequest';
import { MessengerSettings } from './common/MessengerSettings';

interface IFriendsContext
{
    friends: MessengerFriend[];
    requests: MessengerRequest[];
    settings: MessengerSettings;
    canRequestFriend: (userId: number) => boolean;
    requestFriend: (userId: number, userName: string) => void;
    acceptFriend: (userId: number) => void;
    declineFriend: (userId: number, declineAll?: boolean) => void;
}

const FriendsContext = createContext<IFriendsContext>({
    friends: null,
    requests: null,
    settings: null,
    canRequestFriend: null,
    requestFriend: null,
    acceptFriend: null,
    declineFriend: null
});

export const FriendsContextProvider: FC<ProviderProps<IFriendsContext>> = props =>
{
    return <FriendsContext.Provider value={ props.value }>{ props.children }</FriendsContext.Provider>
}

export const useFriendsContext = () => useContext(FriendsContext);
