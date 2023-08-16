import React, { Component } from 'react'

export default class ErrorCatcher extends Component {

    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI.
        return {
            hasError: true,
            error,
        };
    }

    componentDidCatch(error, info) {
        console.log("ErrorCatcher@componentDidCatch: error/info");
        console.log(error);
        console.log(info);

        console.log("ErrorCatcher@componentDidCatch: info cause/stack");
        console.log(error.cause)
        console.log(error.stack)

        this.setState({
            hasError: true,
            catchedError: error,
            info: info
        });
    }

    render() {
        const { hasError, error, catchedError, info } = this.state;

        let errorTrace;
        try {
            errorTrace = error?.trace();
        } catch (error) { }

        let errorToString;
        try {
            errorToString = error?.toString();
        } catch (error) { }

        if (hasError) {
            return (
                <div>
                    <h4>Es ist ein fehler aufgetreten: {error?.message}</h4>
                    <p>{errorToString}</p>
                    <p>Trace:<br /> {errorTrace}</p>
                    <p>CatchedError: <br />{catchedError?.stack}</p>
                    <p>CatchedError Cause: <br />{catchedError?.cause}</p>
                    <p>Info:<br /> {info?.componentStack}</p>
                </div>
            );
        }

        return this.props.children;
    }
}
