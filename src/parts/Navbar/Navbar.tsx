import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { withTranslation, WithTranslation } from 'react-i18next';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAddressCard, faBars, faBook, faBriefcase, faHome } from '@fortawesome/free-solid-svg-icons';
import { faEnvelope } from '@fortawesome/free-regular-svg-icons';

import './Navbar.scss';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

class Navbar extends Component<WithTranslation> {
  NavItem(props: { path: string; name: string; icon: IconProp; isExact?: boolean; className?: string }): JSX.Element {
    const { path, name, icon, isExact = false, className } = props;
    return (
      <li className='nav-item mb-3'>
        <NavLink to={path} className={`nav-link btn bg-dark-color text-color-3 p-3 rounded w-100 ${className}`} activeClassName='active' exact={isExact} aria-current='page'>
          <FontAwesomeIcon icon={icon} /> <span className='ms-2 d-inline d-lg-none'>{name}</span>
        </NavLink>
      </li>
    );
  }

  render(): JSX.Element {
    const { NavItem } = this,
      { t } = this.props;

    return (
      <nav className='navbar navbar-expand-lg'>
        <button
          className='navbar-toggler w-100 d-flex d-lg-none justify-content-end'
          type='button'
          data-bs-toggle='collapse'
          data-bs-target='#navbarNav'
          aria-controls='navbarNav'
          aria-expanded='false'
          aria-label='Toggle navigation'
        >
          <span className='navbar-toggler-icon text-white'>
            <FontAwesomeIcon icon={faBars} size='2x' />
          </span>
        </button>
        <div id='navbarNav' className='collapse navbar-collapse mt-3 mt-lg-0 rounded'>
          <ul className='navbar-nav flex-column'>
            <NavItem path='' name={t('home')} icon={faHome} isExact />
            <NavItem path='about' name={t('about-me')} icon={faAddressCard} />
            <NavItem path='portfolio' name={t('soon')} icon={faBriefcase} className='disabled' />
            <NavItem path='blog' name={t('soon')} icon={faBook} className='disabled' />
            <NavItem path='contact' name={t('soon')} icon={faEnvelope} className='disabled' />
          </ul>
        </div>
      </nav>
    );
  }
}

export default withTranslation()(Navbar);
