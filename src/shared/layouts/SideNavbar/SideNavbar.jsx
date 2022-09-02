import './SideNavbar.scss';

import React from 'react';
import { FaBars } from '@react-icons/all-files/fa/FaBars';
import { FaHome } from '@react-icons/all-files/fa/FaHome';
import { FaAddressCard } from '@react-icons/all-files/fa/FaAddressCard';
import { FaBriefcase } from '@react-icons/all-files/fa/FaBriefcase';
import { FaBook } from '@react-icons/all-files/fa/FaBook';
import { FaEnvelope } from '@react-icons/all-files/fa/FaEnvelope';
import { Link, useTranslation } from 'gatsby-plugin-react-i18next';
import PropTypes from 'prop-types';

import { isUrl } from '../../../core/utils/validation/regexHelper';

function SideNavbar() {
  const { t } = useTranslation();

  const navItems = [
    {
      name: t('home'),
      link: '/',
      icon: <FaHome className="ac-nav-link-icon" />,
      isDisable: false,
    },
    {
      name: t('aboutMe'),
      link: '/about',
      icon: <FaAddressCard className="ac-nav-link-icon" />,
      isDisable: false,
    },
    {
      name: t('portfolio'),
      link: '/portfolio',
      icon: <FaBriefcase className="ac-nav-link-icon" />,
      isDisable: true,
    },
    {
      name: t('blog'),
      link: '/blog',
      icon: <FaBook className="ac-nav-link-icon" />,
      isDisable: true,
    },
    {
      name: t('contactMe'),
      link: 'mailto:ahmetcetinkaya7@outlook.com',
      icon: <FaEnvelope className="ac-nav-link-icon" />,
      isDisable: false,
    },
  ];

  return (
    <nav className="navbar ac-side-navbar">
      <button
        id="navbarToggler"
        className="navbar-toggler w-100 d-flex d-lg-none justify-content-end"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon text-white">
          <FaBars size="2.4rem" />
        </span>
      </button>
      <div
        id="navbarNav"
        className="collapse navbar-collapse mt-3 mt-lg-0 rounded"
      >
        <ul className="navbar-nav flex-column">
          {navItems.map((navItem) => {
            const navLinkClassName = `nav-link ac-nav-link${
              navItem.isDisable ? ' disabled' : ''
            }`;
            return (
              <li key={navItem.link} className="nav-item mb-3">
                {isUrl(navItem.link) ? (
                  <a href={navItem.link} className={navLinkClassName}>
                    <NavItemIcon name={navItem.name} icon={navItem.icon} />
                  </a>
                ) : (
                  <Link
                    to={navItem.link}
                    activeClassName="active"
                    className={navLinkClassName}
                  >
                    <NavItemIcon name={navItem.name} icon={navItem.icon} />
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}

SideNavbar.propTypes = {};

SideNavbar.defaultProps = {};

export default SideNavbar;

function NavItemIcon({ name, icon }) {
  return (
    <>
      {icon}
      <span className="ms-2 d-inline d-lg-none">{name}</span>
    </>
  );
}

NavItemIcon.propTypes = {
  name: PropTypes.string.isRequired,
  icon: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node])
    .isRequired,
};

NavItemIcon.defaultProps = {};
