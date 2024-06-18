import { FC } from 'react';
import { Column, Grid, GridProps, Text } from '../../../common';

export interface InventoryCategoryEmptyViewProps extends GridProps
{
    title: string;
    desc: string;
}

export const InventoryCategoryEmptyView: FC<InventoryCategoryEmptyViewProps> = props =>
{
    const { title = '', desc = '', children = null, ...rest } = props;

    return (
        <Grid { ...rest }>
            <Column center overflow="hidden" size={ 5 }>
                <div className="empty-image" />
            </Column>
            <Column justifyContent="center" overflow="hidden" size={ 7 }>
                <Text truncate fontSize={ 5 } fontWeight="bold" overflow="unset">{ title }</Text>
                <Text overflow="auto">{ desc }</Text>
            </Column>
            { children }
        </Grid>
    );
};
