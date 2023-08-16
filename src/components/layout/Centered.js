import React from 'react'

const Centered = ({ children }) => {
    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", textAlign: "center", minHeight: "80vh" }}>
            <div>
                {children}
            </div>
        </div>
    )
}

export default Centered