import { ButtonHTMLAttributes, FC, useMemo } from "react"
import { ColorVariantType } from "./types"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ColorVariantType;
    active?: boolean;
    classNames?: string[];
}

export const Button: FC<ButtonProps> = (props) => {
    const { variant = "primary", active = false, classNames = [], className = "", children = null, ...rest } = props

    const getClassNames = useMemo(() => {
        const newClassNames: string[] = [ "flex justify-center items-center h-[26px] px-4 text-xs cursor-pointer" ]

        if (variant) newClassNames.push("illumina-btn-" + variant)
        if (variant === "primary" || variant === "success") newClassNames.push("hover:drop-shadow-[0px_0px_4px_#ffffff63] dark:hover:drop-shadow-[0px_0px_4px_#00000063]")

        if (active) newClassNames.push("active")

        if (classNames.length) newClassNames.push(...classNames)

        return newClassNames
    }, [ variant, active, classNames ])

    const getClassName = useMemo(() => {
        let newClassName = getClassNames.join(" ")

        if (className.length) newClassName += (" " + className)

        return newClassName.trim()
    }, [ getClassNames, className ])

    return (
        <button className={getClassName} {...rest}>
            {children}
        </button>
    )
}
