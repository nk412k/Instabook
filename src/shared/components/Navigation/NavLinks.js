import { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../../context/Auth-context';
import './NavLinks.css';

const NavLinks=()=>{

  const auth=useContext(AuthContext);
    return (
      <ul className="nav-links">
        <li>
          <NavLink to="/" exact>
            All Users
          </NavLink>
        </li>
        {auth.isLoggedIn && (
          <li>
            <NavLink to={`/${auth.userId}/posts`}>My Posts</NavLink>
          </li>
        )}
        {auth.isLoggedIn && (
          <li>
            <NavLink to="/posts/new">New Post</NavLink>
          </li>
        )}
        {!auth.isLoggedIn && (
          <li>
            <NavLink to="/auth">Authenticate</NavLink>
          </li>
        )}
        {auth.isLoggedIn && <button onClick={auth.logout}>Logout</button>}
      </ul>
    );
}

export default NavLinks;