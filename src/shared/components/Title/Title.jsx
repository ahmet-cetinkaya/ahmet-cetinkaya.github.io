import './Title.scss';

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

function Title({ title, className }) {
  return <h2 className={classNames(className, 'fs-2 fw-light')}>{title}</h2>;
}

Title.propTypes = {
  title: PropTypes.string.isRequired,
};

Title.defaultProps = {};

export default Title;
