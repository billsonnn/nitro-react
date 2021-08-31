import { createContext, FC, useContext } from 'react';
import { GroupsContextProps, IGroupsContext } from './GroupsContext.types';

const GroupsContext = createContext<IGroupsContext>({
    groupsState: null,
    dispatchGroupsState: null
});

export const GroupsContextProvider: FC<GroupsContextProps> = props =>
{
    return <GroupsContext.Provider value={ props.value }>{ props.children }</GroupsContext.Provider>
}

export const useGroupsContext = () => useContext(GroupsContext);
