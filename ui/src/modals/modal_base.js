import React, { useEffect } from "react";
import * as Util from "../helpers/util";
import Close from "../assets/images/close.svg";

export const ModalBase = props => {
    const { blackout, centered, children, onClose } = props;

    const has_children = !Array.isArray(children) && Util.isObject(children) ||
                         Array.isArray(children) && children.length > 0 && ("filter" in children && children.filter(x => x != false).length > 0)

    useEffect(() => {
        if ( has_children && !document.body.classList.contains('no-scroll-mondays') ) {
            document.body.classList.add('no-scroll-mondays')
        }
        else if ( !has_children && document.body.classList.contains('no-scroll-mondays') ) {
            document.body.classList.remove('no-scroll-mondays')
        }
    }, [children])

    //If we have no children included, then hide everything
    if ( !has_children ) {
        return <></>
    }

    const klass = "details modal " + ((centered)? "modal--centered": "")

    return (
        <>
            {blackout != undefined && blackout &&
                <div className="blackout"></div>
            }
            <div className={klass}>
                {onClose != undefined &&
                    <img src={Close}
                         className="close-btn"
                         onClick={() => onClose(false)}/>
                }

                {children}
            </div>
        </>
    )
};
