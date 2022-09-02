import './IconLabel.scss';

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

function IconLabel({ icon, name, className }) {
  return (
    <div className={classNames('ac-icon-label', className)}>
      {icon}
      <span className="fw-light ms-2">{name}</span>
    </div>
  );
}

IconLabel.propTypes = {
  icon: PropTypes.node.isRequired,
  name: PropTypes.string.isRequired,
};

IconLabel.defaultProps = {};

export default IconLabel;
