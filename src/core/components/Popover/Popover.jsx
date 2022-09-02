import './Popover.scss';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { usePopper } from 'react-popper';
import classNames from 'classnames';

function Popover({ children, title, content, trigger, placement, offset }) {
  const [isShow, setIsShow] = useState(false);
  const [referenceElement, setReferenceElement] = useState(null);
  const [popperElement, setPopperElement] = useState(null);
  const [arrowElement, setArrowElement] = useState(null);
  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement,
    modifiers: [
      { name: 'arrow', options: { element: arrowElement } },
      {
        name: 'offset',
        options: {
          offset,
        },
      },
    ],
  });

  const handleTrigger = () => {
    setIsShow(!isShow);
  };
  const triggerEventAttributes = () => {
    const hoverTriggerEventAttributes = {
      onMouseEnter: handleTrigger,
      onMouseLeave: handleTrigger,
    };
    const focusTriggerEventAttributes = {
      onFocus: handleTrigger,
      onBlur: handleTrigger,
    };

    switch (trigger) {
      case 'click':
        return { onClick: handleTrigger };
      case 'hover':
        return hoverTriggerEventAttributes;
      case 'focus':
        return focusTriggerEventAttributes;
      case 'hover focus':
        return {
          ...hoverTriggerEventAttributes,
          ...focusTriggerEventAttributes,
        };
      default:
        return {};
    }
  };

  return (
    <>
      <span
        type="button"
        key={content}
        ref={setReferenceElement}
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...triggerEventAttributes()}
      >
        {children}
      </span>

      <div
        ref={setPopperElement}
        className={classNames('popover ac-popover bs-popover-auto fade', {
          show: isShow,
        })}
        style={styles.popper}
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...attributes.popper}
      >
        {title && <h3 className="popover-header">{title}</h3>}
        <div className="popover-body">{content}</div>
        <div
          ref={setArrowElement}
          className="popover-arrow"
          style={styles.arrow}
        />
      </div>
    </>
  );
}

Popover.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
  title: PropTypes.string,
  content: PropTypes.string.isRequired,
  trigger: PropTypes.oneOf(['click', 'hover', 'focus', 'hover focus']),
  placement: PropTypes.oneOf([
    'top',
    'bottom',
    'left',
    'right',
    'auto',
    'auto-start',
    'auto-end',
    'top-start',
    'top-end',
    'bottom-start',
    'bottom-end',
    'right-start',
    'right-end',
    'left-start',
    'left-end',
  ]),
  offset: (props, propName) => {
    if (
      !Array.isArray(props.offset) ||
      props.offset.length !== 2 ||
      !props.offset.every(Number.isInteger)
    )
      return new Error(`${propName} needs to be an array of two numbers`);
    return null;
  },
};

Popover.defaultProps = {
  title: null,
  trigger: 'hover focus',
  placement: 'top',
  offset: [0, 10],
};

export default Popover;
