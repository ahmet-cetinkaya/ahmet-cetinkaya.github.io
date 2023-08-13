import './Credit.scss';

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FaCreativeCommons } from 'react-icons/fa';
import classNames from 'classnames';
import Popover from '../Popover/Popover';

function Credit({ content, classNames: { containerClassName } }) {
  const [isShow, setIsShow] = useState(false);

  const handleCreditButtonClick = () => {
    setIsShow(!isShow);
  };
  
  return (
    <div className={containerClassName}>
      <Popover content={content} trigger="click">
        <button
          type="button"
          className={classNames('ac-credit-button', {
            'text-light border': isShow,
          })}
          onClick={handleCreditButtonClick}
        >
          <FaCreativeCommons />
        </button>
      </Popover>
    </div>
  );
}

Credit.propTypes = {
  content: PropTypes.node.isRequired,
  classNames: PropTypes.shape({
    containerClassName: PropTypes.string,
  }),
};

Credit.defaultProps = {
  classNames: {
    containerClassName: '',
  },
};

export default Credit;
