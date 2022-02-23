import { FC } from 'react';
import { Column } from '../../../../common/Column';
import { Grid, GridProps } from '../../../../common/Grid';
import { Text } from '../../../../common/Text';

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
            <Column center size={ 5 } overflow="hidden">
                <div className="empty-image" />
            </Column>
            <Column justifyContent="center" size={ 7 } overflow="hidden">
                <Text fontWeight="bold" fontSize={ 5 } overflow="unset" truncate>{ title }</Text>
                <Text overflow="auto">{ desc }</Text>
            </Column>
            { children }
        </Grid>
    );
}
