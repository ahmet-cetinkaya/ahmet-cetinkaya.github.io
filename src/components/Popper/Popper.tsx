import { Popover } from 'bootstrap';
import React, { Component } from 'react';

import './Popper.scss';

interface Props {
  children: JSX.Element;
  text: string;
  title?: string;
  className?: string;
  trigger?: 'click' | 'focus' | 'hover' | 'hover focus';
  placement?: 'auto' | 'top' | 'bottom' | 'left' | 'right';
  offset?: [number, number];
}
//interface State {}

export default class Popper extends Component<Props> {
  componentDidMount(): void {
    const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    popoverTriggerList.map((popoverTriggerEl) => new Popover(popoverTriggerEl));
  }
  render(): JSX.Element {
    const { children, text, title, trigger, placement, offset } = this.props;

    return (
      <div
        data-bs-toggle='popover'
        title={title}
        data-bs-content={text}
        data-bs-trigger={trigger}
        data-bs-placement={placement}
        data-bs-offset={offset?.toString()}
        data-bs-custom-class='bg-dark-color-2 text-white rounded p-1 shadow'
      >
        {children}
      </div>
    );
  }
}
