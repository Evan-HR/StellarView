import React from 'react';
import { Link } from 'react-router-dom';

const Navlinks = () => {
    return ( 
        <ul className="nav-links">
        <li>
            <Link to="/" className="link">Home</Link>
        </li>
        <li>
        <Link to="/Register" className="link">Login</Link>
        </li>
        <li>
            <Link to="/Register" className="link">Register</Link>
        </li>
        <li>
            <Link to="/about" className="link">FAQ</Link>
        </li>

    </ul>
     );
}
 
export default Navlinks;