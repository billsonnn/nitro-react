import { Dispatch, ProviderProps } from 'react';
import { INavigatorAction, INavigatorState } from '../reducers/NavigatorReducer';

export interface INavigatorContext
{
    navigatorState: INavigatorState;
    dispatchNavigatorState: Dispatch<INavigatorAction>;
}

export interface NavigatorContextProps extends ProviderProps<INavigatorContext>
{

}
