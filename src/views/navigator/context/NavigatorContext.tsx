import { createContext, FC, useContext } from 'react';
import { INavigatorContext, NavigatorContextProps } from './NavigatorContext.types';

const NavigatorContext = createContext<INavigatorContext>({
    navigatorState: null,
    dispatchNavigatorState: null
});

export const NavigatorContextProvider: FC<NavigatorContextProps> = props =>
{
    return <NavigatorContext.Provider value={ props.value }>{ props.children }</NavigatorContext.Provider>
}

export const useNavigatorContext = () => useContext(NavigatorContext);
