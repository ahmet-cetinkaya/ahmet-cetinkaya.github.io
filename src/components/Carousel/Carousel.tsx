import React, { Component } from 'react';

interface Props {
  id?: string;
  carouselControl?: boolean;
}

export default class Carousel extends Component<Props> {
  CarouselIndicator(props: { id: string; slideIndex: number; isActive: boolean }): JSX.Element {
    return (
      <button
        type='button'
        data-bs-target={`#${props.id}`}
        data-bs-slide-to={props.slideIndex}
        className={props.isActive ? 'active' : ''}
        aria-current='true'
        aria-label='Slide 1'
      />
    );
  }

  render(): JSX.Element {
    const { id = 'carousel', carouselControl = true, children } = this.props;
    return (
      <div id={id} className='carousel slide' data-bs-ride='carousel'>
        <div className='carousel-indicators'>
          {children &&
            React.Children.map(children, (_, i) => (
              <button type='button' data-bs-target={`#${id}`} data-bs-slide-to={i} className={i == 0 ? 'active' : ''} aria-current='true' aria-label={`Slide ${i}`} />
            ))}
        </div>
        <div className='carousel-inner'>{children && React.Children.map(children, (child, i) => <div className={`carousel-item ${i == 0 ? 'active' : ''}`}>{child}</div>)}</div>

        {carouselControl && (
          <>
            <button className='carousel-control-prev' type='button' data-bs-target={`#${id}`} data-bs-slide='prev'>
              <span className='carousel-control-prev-icon' aria-hidden='true' />
              <span className='visually-hidden'>Previous</span>
            </button>
            <button className='carousel-control-next' type='button' data-bs-target={`#${id}`} data-bs-slide='next'>
              <span className='carousel-control-next-icon' aria-hidden='true' />
              <span className='visually-hidden'>Next</span>
            </button>
          </>
        )}
      </div>
    );
  }
}
