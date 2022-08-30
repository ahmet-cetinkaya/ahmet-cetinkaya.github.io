import './IconButton.scss';
import PropTypes from 'prop-types';
import React from 'react';
import {Link} from 'gatsby-plugin-react-i18next';
import classNames from 'classnames';

function IconButton({url, route, onClick, icon, className}) {
  const iconButtonClassName = classNames('ac-icon-button', className);

  if (route)
    return (
      <Link to={route} className={iconButtonClassName}>
        {icon}
      </Link>
    );

  if (onClick)
    return (
      <button type="button" onClick={onClick} className={iconButtonClassName}>
        {icon}
      </button>
    );

  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className={iconButtonClassName}
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
