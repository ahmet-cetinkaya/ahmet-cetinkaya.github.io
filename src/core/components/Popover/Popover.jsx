import './Popover.scss';
import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import {Popover as BsPopover} from 'bootstrap';

function Popover({children, title, content, trigger, placement, offset}) {
  useEffect(() => {
    const popoverTriggerList = [].slice.call(
      document.querySelectorAll('[data-bs-toggle="popover"]')
    );
    popoverTriggerList.map(popoverTriggerEl => new BsPopover(popoverTriggerEl));
  }, []);

  return (
    <span
      data-bs-toggle="popover"
      title={title}
      data-bs-content={content}
      data-bs-trigger={trigger}
      data-bs-placement={placement}
      data-bs-offset={offset?.toString()}
      data-bs-custom-class="text-white rounded p-1 shadow ac-bg-dark-color-2"
    >
      {children}
    </span>
  );
}

Popover.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
  content: PropTypes.string.isRequired,
  trigger: PropTypes.oneOf([null, 'hover', 'focus', 'hover focus']),
  placement: PropTypes.oneOf(['top', 'bottom', 'right', 'left']),
  offset: PropTypes.number,
};

Popover.defaultProps = {
  title: null,
  trigger: 'hover focus',
  placement: 'top',
  offset: null,
};

export default Popover;
