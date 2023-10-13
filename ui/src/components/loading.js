import React from 'react';

export const Loading = (props) => {
    const { msg } = props;
    return (
        <div id="preloader">
            <p style={{color: "red"}}>{msg}</p>
        </div>
    );
}
