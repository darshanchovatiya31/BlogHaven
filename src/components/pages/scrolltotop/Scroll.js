import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const Scroll = ({ children }) => {

    const { pathname } = useLocation();
    useEffect(() => {
        window.scroll({
            top:0,
            behavior: "smooth",
        });
    }, [pathname])

    return (
        <>
            {children}
        </>
    )
}

export default Scroll