import { FC } from "react"
import { BaseProps } from ".."

interface LayoutSubViewProps extends BaseProps<HTMLDivElement>
{
    onClick: React.MouseEventHandler<HTMLDivElement>;
}

export const LayoutSubView: FC<LayoutSubViewProps> = ({ onClick }) =>
{
    return (
        <i className="block size-5 cursor-pointer bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[0_-181px] hover:bg-[-21px_-181px] active:bg-[-42px_-181px]" onClick={ onClick } />
    )
}
