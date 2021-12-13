import { createContext, Dispatch, FC, ProviderProps, useContext } from 'react';
import { INavigatorAction, INavigatorState } from '../reducers/NavigatorReducer';

export interface INavigatorContext
{
    navigatorState: INavigatorState;
    dispatchNavigatorState: Dispatch<INavigatorAction>;
}

const NavigatorContext = createContext<INavigatorContext>({
    navigatorState: null,
    dispatchNavigatorState: null
});

export const NavigatorContextProvider: FC<ProviderProps<INavigatorContext>> = props =>
{
    return <NavigatorContext.Provider value={ props.value }>{ props.children }</NavigatorContext.Provider>
}

export const useNavigatorContext = () => useContext(NavigatorContext);
