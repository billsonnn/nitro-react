import { createContext, FC, useContext } from 'react';
import { FriendsContextProps, IFriendsContext } from './FriendsContext.type';

const FriendsContext = createContext<IFriendsContext>({
    friendsState: null,
    dispatchFriendsState: null
});

export const FriendsContextProvider: FC<FriendsContextProps> = props =>
{
    return <FriendsContext.Provider value={ props.value }>{ props.children }</FriendsContext.Provider>
}

export const useFriendsContext = () => useContext(FriendsContext);
