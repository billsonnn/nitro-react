import { FC } from 'react';
import { AutoSizer, List, ListRowProps, ListRowRenderer } from 'react-virtualized';
import { ModToolsPickedIssuesTabViewProps } from './ModToolsPickedIssuesTabView.types';

export const ModToolsPickedIssuesTabView: FC<ModToolsPickedIssuesTabViewProps> = props =>
{
    const { pickedIssues = null } = props;

    const RowRenderer: ListRowRenderer = (props: ListRowProps) =>
    {
        const item = pickedIssues[props.index];

        return (
            <div key={props.key} style={props.style} className="row issue-entry justify-content-start">
                    <div className="col-auto text-center">{item.categoryId}</div>
                    <div className="col justify-content-start username"><span className="fw-bold cursor-pointer">{item.reportedUserName}</span></div>
                    <div className="col-sm-2 justify-content-start"><span className="text-break text-wrap h-100">{item.getOpenTime(new Date().getTime())}</span></div>
                    <div className="col-sm-2">
                        {item.pickerUserName}
                    </div>
            </div>
        );
    };
    
    return (
        <>
        <div className="row align-items-start w-100">
            <div className="col-auto text-center fw-bold">Type</div>
            <div className="col fw-bold">Room/Player</div>
            <div className="col-sm-2 fw-bold">Opened</div>
            <div className="col-sm-2 fw-bold">Picker</div>
        </div>
        <div className="row w-100 h-100 issues">
            <AutoSizer defaultWidth={400} defaultHeight={200}>
                {({ height, width }) => 
                {
                    return (
                        <List
                            width={width}
                            height={height}
                            rowCount={pickedIssues.length}
                            rowHeight={25}
                            className={'issues-container'}
                            rowRenderer={RowRenderer}
                            />
                    )
                }
                }
            </AutoSizer>
        </div>
        </>
    );
}
