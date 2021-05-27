import React, { Component } from 'react';

import tiltElementOnMouseMove from '../../utils/tiltElementOnMouseMove';
import './Card.scss';

interface Props {
  children: React.ReactNode;
}

export default class Card extends Component<Props> {
  state = {
    cardStyle: {
      transform: undefined,
    },
  };

  componentDidMount(): void {
    document.addEventListener('mousemove', this.setCardTransformStyle.bind(this));
    document.addEventListener('mouseleave', this.resetCardTransformStyle.bind(this));
  }

  setCardTransformStyle(e: MouseEvent): void {
    if (document.body.clientWidth <= 992) return this.resetCardTransformStyle();

    this.setState({
      cardStyle: {
        transform: tiltElementOnMouseMove(e, 4),
      },
    });
  }

  resetCardTransformStyle(): void {
    this.setState({
      cardStyle: {
        transform: 'none',
      },
    });
  }

  render(): JSX.Element {
    const { cardStyle } = this.state;

    return (
      <div id='card' className='container d-flex flex-column p-4 p-lg-5 bg-dark-color text-color rounded-3 shadow' style={cardStyle}>
        {this.props.children}
      </div>
    );
  }
}
