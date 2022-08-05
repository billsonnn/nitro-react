import { FC } from 'react';
import { Base, Column, LayoutProgressBar, Text } from '../../common';

interface LoadingViewProps
{
    isError: boolean;
    message: string;
    percent: number;
}

export const LoadingView: FC<LoadingViewProps> = props =>
{
    const { isError = false, message = '', percent = 0 } = props;
    
    return (
        <Column fullHeight position="relative" className="nitro-loading">
            <Base fullHeight className="container h-100">
                <Column fullHeight alignItems="center" justifyContent="end">
                    <Base className="connecting-duck" />
                    <Column size={ 6 } className="text-center py-4">
                        { isError && (message && message.length) ?
                            <Base className="fs-4 text-shadow">{ message }</Base>
                            :
                            <>
                                <Text fontSize={ 4 } variant="white" className="text-shadow">{ percent.toFixed() }%</Text>
                                <LayoutProgressBar progress={ percent } className="mt-2 large" />
                            </>
                        }
                        
                    </Column>
                </Column>
            </Base>
        </Column>
    );
}
