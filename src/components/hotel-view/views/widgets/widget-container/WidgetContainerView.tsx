import { NitroConfiguration } from "@nitrots/nitro-renderer"
import { FC } from "react"

export interface WidgetContainerViewProps
{
    conf: any;
}

export const WidgetContainerView: FC<WidgetContainerViewProps> = props =>
{
    const { conf = null } = props

    const getOption = (key: string) =>
    {
        const option = conf[key]

        if(!option) return null

        switch(key)
        {
        case "image":
            return NitroConfiguration.interpolate(option)
        }

        return option
    }

  	return null
}
