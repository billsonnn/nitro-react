import { createContext, Dispatch, FC, ProviderProps, SetStateAction, useContext } from 'react';
import { IGroupCustomize } from './common/IGroupCustomize';

interface IGroupsContext
{
    groupCustomize: IGroupCustomize;
    setGroupCustomize: Dispatch<SetStateAction<IGroupCustomize>>;
}

const GroupsContext = createContext<IGroupsContext>({
    groupCustomize: null,
    setGroupCustomize: null
});

export const GroupsContextProvider: FC<ProviderProps<IGroupsContext>> = props =>
{
    return <GroupsContext.Provider value={ props.value }>{ props.children }</GroupsContext.Provider>
}

export const useGroupsContext = () => useContext(GroupsContext);
