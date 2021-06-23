import { createContext, FC, useContext } from 'react';
import { FriendListContextProps, IFriendListContext } from './FriendListContext.type';

const FriendListContext = createContext<IFriendListContext>({
    friendListState: null,
    dispatchFriendListState: null
});

export const FriendListContextProvider: FC<FriendListContextProps> = props =>
{
    return <FriendListContext.Provider value={ props.value }>{ props.children }</FriendListContext.Provider>
}

export const useFriendListContext = () => useContext(FriendListContext);
