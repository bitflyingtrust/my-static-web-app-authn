import React, {useState, useEffect} from 'react';
import { NavLink } from 'react-router-dom';

/* eslint-disable no-unused-vars */

const NavBar = (props) => {
  const [userInfo, setUserInfo] = useState();
  const providers = ['twitter', 'github', 'aad'];
  const redirect = window.location.pathname;

  useEffect(() => {
    (async () => {
      setUserInfo(await getUserInfo());
      console.log('NavBar call', userInfo, redirect)
    })();
  }, []);
  
  async function getUserInfo() {
    try {
      const response = await fetch('/.auth/me');
      const payload = await response.json();
      const { clientPrincipal } = payload;
      return clientPrincipal;
    } catch (error) {
      console.error('No profile could be found');
      return undefined;
    }
  }

  return (
    <div className="column is-2">
      <nav className="menu">
        <p className="menu-label">Menu</p>
        <ul className="menu-list">
          <NavLink to="/products" activeClassName="active-link">
            Products
          </NavLink>
          <NavLink to="/about" activeClassName="active-link">
            About
          </NavLink>
        </ul>
        {props.children}
      </nav>
      <nav className="menu auth">
        <p className="menu-label">Auth</p>
        <div className="menu-list auth">
          {!userInfo && providers.map((provider) => (
            <a key={provider} href={`/.auth/login/${provider}?post_login_redirect_uri=${redirect}`}>
              {provider}
            </a>
          ))}
          {userInfo && (
            <a href={`/.auth/logout?post_logout_redirect_uri=${redirect}`}>
              Logout
            </a>
          )}
        </div>
      </nav>
      {userInfo && (
        <div>
          <div className="user">
            <p>Welcome</p>
            <p>{userInfo && userInfo.userDetails}</p>
            <p>{userInfo && userInfo.identityProvider}</p>
          </div>
        </div>
      )}
    </div>
  );
};

/* eslint-enable no-unused-vars */

export default NavBar;
