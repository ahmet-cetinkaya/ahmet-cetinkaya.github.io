import './Label.scss';

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

function Label({ icon, name, className }) {
  return (
    <div className={classNames('ac-icon-label', className)}>
      {icon && icon}
      <span className={classNames('fw-light', { 'ms-2': icon })}>{name}</span>
    </div>
  );
}

Label.propTypes = {
  icon: PropTypes.node,
  name: PropTypes.string.isRequired,
};

Label.defaultProps = {
  icon: undefined,
};

export default Label;
