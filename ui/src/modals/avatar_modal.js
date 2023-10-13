import React, {useEffect, useRef, useState} from 'react';
import * as Util from '../helpers/util';

import Close from "../assets/images/close.svg";

export const AvatarModal = (props) => {
    const { target, showToast, onSelect, onClose} = props

    const [state, setState] = useState({
        avatars: [],
    })
    const { avatars } = state

    useEffect(() => {
        Util.fetch_js(`/api/avatar/${target}/`, {},
            js => {
                console.log(js.avatars)
                setState(prev => ({ ...prev,
                    avatars: js.avatars,
                }))
            },
            showToast )

    }, [])

    return (
        <>
            <section className="h-100 gradient-form">
                {onClose != undefined &&
                    <img src={Close}
                         className="close-btn"
                         onClick={() => onClose(false)}/>
                }
                <div className="container">
                    <div className="badge-widget-container">
                        {Object.entries(avatars).map(([k,avatar]) =>
                            <div className="badge-widget"
                                 key={`avatar_key_${k}`}
                                 onClick={() => onSelect(avatar)}>
                                <img src={avatar.img_url} alt="feature"
                                     className="feature-img"/>
                                <p>{avatar.name}</p>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </>
    );
}
