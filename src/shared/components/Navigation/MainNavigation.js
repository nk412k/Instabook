import { Link } from 'react-router-dom';
import React,{useState} from 'react';
import MainHeader from './MainHeader';
import './MainNavigation.css';
import NavLinks from './NavLinks';
import SideDrawer from './SideDrawer';
import Backdrop from '../UIElements/BackDrop';

const MainNavigation=()=>{
    const [drawerIsOpen,setDrawerIsOpen]=useState(false);
    const setDrawerOpen=()=>{
        setDrawerIsOpen(true);
    }

    const setDrawerClose=()=>{
        setDrawerIsOpen(false);
    }
    return (
      <React.Fragment>
        {drawerIsOpen && <Backdrop  onClick={setDrawerClose}/>} 
        <SideDrawer show={drawerIsOpen} onClick={setDrawerClose}>
          <nav>
            <NavLinks />
          </nav>
        </SideDrawer>
        <MainHeader>
          <button className="main-navigation__menu-btn" onClick={setDrawerOpen}>
            <span />
            <span />
            <span />
          </button>
          <h1 className="main-navigation__title">
            <Link to="/">InstaBook</Link>
          </h1>
          <nav className="main-navigation__header-nav">
            <NavLinks />
          </nav>
        </MainHeader>
      </React.Fragment>
    );
}

export default MainNavigation;