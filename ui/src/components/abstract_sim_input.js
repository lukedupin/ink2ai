import React, { useState, useRef, useEffect } from "react"

export const AbstractSimInput = ({ onSubmit }) => {
    const [input, setInput] = useState("")

    const handleSubmit = (e) => {
        e.preventDefault()
        onSubmit(input)
    }

    const handleChange = (e) => {
        setInput(e.target.value)
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            onSubmit(input)
        }
    }

    return (
        <div className="profile-container">
            <div className="main-profile col-md-6">
                <div className="row">
                    <div className="col-md-12">
                        <div className="form-group">
                            <textarea type="search"
                                      className="form-control"
                                      placeholder="Search the patent landscape"
                                      name="input"
                                      value={input}
                                      onChange={handleChange}
                                      onKeyDown={handleKeyPress}
                            />
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <input type="button"
                               name="submit"
                               value="Search"
                               className="button"
                               style={{
                                   margin: 'auto',
                               }}
                               onClick={handleSubmit}/>
                    </div>
                </div>
            </div>
        </div>
    )
}