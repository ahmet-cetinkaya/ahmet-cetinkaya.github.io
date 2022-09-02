import './IconButton.scss';
import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'gatsby-plugin-react-i18next';
import classNames from 'classnames';
import { isUrl } from '../../utils/validation/regexHelper';

function IconButton({ link, onClick, icon, className, ...attributes }) {
  const iconButtonClassName = classNames('ac-icon-button', className);

  if (link) {
    if (isUrl(link)) {
      return (
        <a
          href={link}
          target="_blank"
          rel="noreferrer"
          className={iconButtonClassName}
        >
          {icon}
        </a>
      );
    }

    return (
      <Link to={link} className={iconButtonClassName}>
        {icon}
      </Link>
    );
  }

  return (
    <button
      type="button"
      className={iconButtonClassName}
      onClick={onClick}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...attributes}
    >
      {icon}
    </button>
  );
}

IconButton.propTypes = {
  link: PropTypes.string,
  onClick: PropTypes.func,
  icon: PropTypes.node.isRequired,
  className: PropTypes.string,
};

IconButton.defaultProps = {
  link: '',
  onClick: null,
  className: '',
};

export default IconButton;
