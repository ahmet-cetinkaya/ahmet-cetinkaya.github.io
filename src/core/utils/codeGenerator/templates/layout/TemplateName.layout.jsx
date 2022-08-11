import './TemplateName.layout.scss';

import PropTypes from 'prop-types';
import React from 'react';

function TemplateName({children}) {
  return (
    <div className="TemplateName" data-testid="TemplateName">
      TemplateName Component
      {children}
    </div>
  );
}

TemplateName.propTypes = {children: PropTypes.elementType.isRequired};

TemplateName.defaultProps = {};

export default TemplateName;
