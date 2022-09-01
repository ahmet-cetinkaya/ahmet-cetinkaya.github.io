import './SilhouetteTitle.scss';

import React from 'react';
import PropTypes from 'prop-types';

function SilhouetteTitle({title, backTitle}) {
  return (
    <header className="position-relative text-uppercase text-center mt-2 mb-5">
      <h1 className="fw-bold m-0 ac-text-accent">{title}</h1>
      <span className="fw-bold ac-bg-text ac-background-title">
        {backTitle || title}
      </span>
    </header>
  );
}

SilhouetteTitle.propTypes = {
  title: PropTypes.string.isRequired,
  backTitle: PropTypes.string,
};

SilhouetteTitle.defaultProps = {
  backTitle: null,
};

export default SilhouetteTitle;
