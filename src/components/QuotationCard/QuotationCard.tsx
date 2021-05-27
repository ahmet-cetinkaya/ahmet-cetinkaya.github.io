import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuoteLeft, faQuoteRight } from '@fortawesome/free-solid-svg-icons';

import './QuatationCard.scss';

interface Props {
  text: string;
  name: string;
  nameDesc?: string;
  imageUrl?: string;
  link?: string;
}

const QuotationContent = (props: { text: string; name: string; nameDesc?: string; imageUrl?: string }): JSX.Element => {
  const { text, name, nameDesc, imageUrl } = props;

  return (
    <div className='quotation-content bg-dark-color-2 p-5 rounded border border-secondary'>
      {imageUrl && (
        <div className='quotation-picture position-absolute d-block'>
          <img src={imageUrl} alt={name} className='d-inline rounded-circle border-dark img-fluid' />
        </div>
      )}
      <div className='quotation-text'>
        <p>{text}</p>
      </div>

      <div className='quotation-author-info'>
        <h5 className='quotation-author fw-bold fs-6'>{name}</h5>
        {nameDesc && <p className='quotation-firm fw-light fs-6'>{nameDesc}</p>}
      </div>

      <div className='quotation-icon d-block position-absolute text-white'>
        <FontAwesomeIcon icon={faQuoteLeft} />
      </div>
      <div className='quotation-icon-big d-block position-absolute text-white'>
        <FontAwesomeIcon icon={faQuoteRight} />
      </div>
    </div>
  );
};

export default class QuotationCard extends Component<Props> {
  QuotationContent(props: { text: string; name: string; nameDesc?: string; imageUrl?: string }): JSX.Element {
    return (
      <div className='quotation-content bg-dark-color-2 p-5 rounded border border-secondary'>
        {props.imageUrl && (
          <div className='quotation-picture position-absolute d-block'>
            <img src={props.imageUrl} alt={props.name} className='d-inline rounded-circle border-dark img-fluid' />
          </div>
        )}
        <div className='quotation-text'>
          <p>{props.text}</p>
        </div>
        <div className='quotation-author-info'>
          <h5 className='quotation-author fw-bold fs-6'>{props.name}</h5>
          {props.nameDesc && <p className='quotation-firm fw-light fs-6'>{props.nameDesc}</p>}
        </div>
        <div className='quotation-icon d-block position-absolute text-white'>
          <FontAwesomeIcon icon={faQuoteLeft} />
        </div>
        <div className='quotation-icon-big d-block position-absolute text-white'>
          <FontAwesomeIcon icon={faQuoteRight} />
        </div>
      </div>
    );
  }

  render(): JSX.Element {
    const { text, name, nameDesc, imageUrl, link } = this.props;
    return (
      <div className='quotation-item position-relative p-4'>
        {(link && (
          <a href={link} target='_blank' rel='noreferrer' className='text-decoration-none link-light'>
            <QuotationContent text={text} name={name} nameDesc={nameDesc} imageUrl={imageUrl} />
          </a>
        )) || <QuotationContent text={text} name={name} nameDesc={nameDesc} imageUrl={imageUrl} />}
      </div>
    );
  }
}
