import { createContext, Dispatch, FC, ProviderProps, useContext } from 'react';
import { IGroupsAction, IGroupsState } from './reducers/GroupsReducer';

interface IGroupsContext
{
    groupsState: IGroupsState;
    dispatchGroupsState: Dispatch<IGroupsAction>;
}

const GroupsContext = createContext<IGroupsContext>({
    groupsState: null,
    dispatchGroupsState: null
});

export const GroupsContextProvider: FC<ProviderProps<IGroupsContext>> = props =>
{
    return <GroupsContext.Provider value={ props.value }>{ props.children }</GroupsContext.Provider>
}

export const useGroupsContext = () => useContext(GroupsContext);
