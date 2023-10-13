import React from 'react';

//State wrapper
const withStore = BaseComponent => props => {
    //const { usr_info } = useStore( state => ({ usr_info: state.usr_info }));
    return <BaseComponent {...props} />;
};

//Define my view compon
class Klass extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const { msg, status } = this.props

        //Nothing actually changed
        if ( msg == "" ) {
            return;
        }

        //Set my timer to call my onComplete flag
        const { onComplete, timeout } = this.props;
        setTimeout( onComplete, timeout );
    }

    render() {
        const { msg, status, onComplete } = this.props;

        //If there is nothing, then show nothing
        if ( msg == "" ) {
            return (
                <></>
            );
        }

        if ( status != "success" ) {
            console.log(status +": "+ msg );
        }

        return (
            <div className={"action-toast action-"+ status}>
                <div className="action-toast-message">
                    <div className="action-toast-message-icon">

                        {status == "success" &&
                        <svg width="34" height="35" viewBox="0 0 34 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M33.9531 17.875C33.9531 8.57812 26.2969 0.921875 17 0.921875C7.63477 0.921875 0.046875 8.57812 0.046875 17.875C0.046875 27.2402 7.63477 34.8281 17 34.8281C26.2969 34.8281 33.9531 27.2402 33.9531 17.875ZM15.0176 26.8984C14.6074 27.3086 13.8555 27.3086 13.4453 26.8984L6.33594 19.7891C5.92578 19.3789 5.92578 18.627 6.33594 18.2168L7.9082 16.7129C8.31836 16.2344 9.00195 16.2344 9.41211 16.7129L14.2656 21.498L24.5195 11.2441C24.9297 10.7656 25.6133 10.7656 26.0234 11.2441L27.5957 12.748C28.0059 13.1582 28.0059 13.9102 27.5957 14.3203L15.0176 26.8984Z"
                                fill="#277444"></path>
                        </svg>
                        }

                        {status == "failure" &&
                        <svg width="22" height="21" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M7.93359 5.375L10.8633 2.44531C11.2441 2.09375 11.2441 1.50781 10.8633 1.15625L10.2188 0.511719C9.86719 0.130859 9.28125 0.130859 8.92969 0.511719L6 3.44141L3.04102 0.511719C2.68945 0.130859 2.10352 0.130859 1.75195 0.511719L1.10742 1.15625C0.726562 1.50781 0.726562 2.09375 1.10742 2.44531L4.03711 5.375L1.10742 8.33398C0.726562 8.68555 0.726562 9.27148 1.10742 9.62305L1.75195 10.2676C2.10352 10.6484 2.68945 10.6484 3.04102 10.2676L6 7.33789L8.92969 10.2676C9.28125 10.6484 9.86719 10.6484 10.2188 10.2676L10.8633 9.62305C11.2441 9.27148 11.2441 8.68555 10.8633 8.33398L7.93359 5.375Z"
                                fill="#FD6E6E"></path>
                        </svg>
                        }

                        {status == "error" &&
                        <svg width="22" height="21" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M7.93359 5.375L10.8633 2.44531C11.2441 2.09375 11.2441 1.50781 10.8633 1.15625L10.2188 0.511719C9.86719 0.130859 9.28125 0.130859 8.92969 0.511719L6 3.44141L3.04102 0.511719C2.68945 0.130859 2.10352 0.130859 1.75195 0.511719L1.10742 1.15625C0.726562 1.50781 0.726562 2.09375 1.10742 2.44531L4.03711 5.375L1.10742 8.33398C0.726562 8.68555 0.726562 9.27148 1.10742 9.62305L1.75195 10.2676C2.10352 10.6484 2.68945 10.6484 3.04102 10.2676L6 7.33789L8.92969 10.2676C9.28125 10.6484 9.86719 10.6484 10.2188 10.2676L10.8633 9.62305C11.2441 9.27148 11.2441 8.68555 10.8633 8.33398L7.93359 5.375Z" fill="#FD6E6E"></path>
                        </svg>
                        }
                    </div>
                    <p>{msg}</p>
                </div>

                <div className="action-toast-message-close" onClick={onComplete}>
                    <svg width="12" height="11" viewBox="0 0 12 11" fill="none"
                         xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M7.93359 5.375L10.8633 2.44531C11.2441 2.09375 11.2441 1.50781 10.8633 1.15625L10.2188 0.511719C9.86719 0.130859 9.28125 0.130859 8.92969 0.511719L6 3.44141L3.04102 0.511719C2.68945 0.130859 2.10352 0.130859 1.75195 0.511719L1.10742 1.15625C0.726562 1.50781 0.726562 2.09375 1.10742 2.44531L4.03711 5.375L1.10742 8.33398C0.726562 8.68555 0.726562 9.27148 1.10742 9.62305L1.75195 10.2676C2.10352 10.6484 2.68945 10.6484 3.04102 10.2676L6 7.33789L8.92969 10.2676C9.28125 10.6484 9.86719 10.6484 10.2188 10.2676L10.8633 9.62305C11.2441 9.27148 11.2441 8.68555 10.8633 8.33398L7.93359 5.375Z"
                            fill="currentColor"></path>
                    </svg>
                </div>
            </div>
        );
    }
}

export const Toast = withStore(Klass);
