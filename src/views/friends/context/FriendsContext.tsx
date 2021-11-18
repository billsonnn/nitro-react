import { createContext, FC, useContext } from 'react';
import { FriendsContextProps, IFriendsContext } from './FriendsContext.type';

const FriendsContext = createContext<IFriendsContext>({
    friends: null,
    requests: null,
    settings: null,
    canRequestFriend: null,
    requestFriend: null,
    acceptFriend: null,
    declineFriend: null
});

export const FriendsContextProvider: FC<FriendsContextProps> = props =>
{
    return <FriendsContext.Provider value={ props.value }>{ props.children }</FriendsContext.Provider>
}

export const useFriendsContext = () => useContext(FriendsContext);
