import React, { Component, ReactNode } from "react";
import classNames from "classnames";
import "./Spinner.scss";

interface SpinnerProps {
    className?: string;
}

/**
 * Component which will display a spinner.
 */
class Spinner extends Component<SpinnerProps> {
    /**
     * Render the component.
     * @returns The node to render.
     */
    public render(): ReactNode {
        const { className, ...props } = this.props;
        return (
            <div {...props} className={classNames("spinner", className)} />
        );
    }
}

export default Spinner;
