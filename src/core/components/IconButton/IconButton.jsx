import './IconButton.scss';
import PropTypes from 'prop-types';
import React from 'react';
import {Link} from 'gatsby-plugin-react-i18next';

function IconButton({url, route, onClick, icon, className}) {
  if (route)
    return (
      <Link to={route} className={`ac-icon-button ${className}`}>
        {icon}
      </Link>
    );

  if (onClick)
    return (
      <button
        type="button"
        onClick={onClick}
        className={`ac-icon-button ${className}`}
      >
        {icon}
      </button>
    );

  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className={`ac-icon-button ${className}`}
    >
      {icon}
    </a>
  );
}

IconButton.propTypes = {
  url: PropTypes.string,
  route: PropTypes.string,
  onClick: PropTypes.func,
  icon: PropTypes.node.isRequired,
  className: PropTypes.string,
};

IconButton.defaultProps = {
  url: '',
  route: '',
  onClick: null,
  className: '',
};

export default IconButton;
