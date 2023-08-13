import './QuotationCard.scss';

import React from 'react';
import PropTypes from 'prop-types';
import { FaQuoteLeft, FaQuoteRight, FaChevronRight } from 'react-icons/fa';

function QuotationCard({ name, text, bio, imageUrl, link }) {
  const content = (
    <QuotationCardContent
      text={text}
      name={name}
      bio={bio}
      imageUrl={imageUrl}
      link={link}
    />
  );

  return (
    <div className="ac-quotation-card-item">
      {link ? (
        <a
          href={link}
          target="_blank"
          rel="noreferrer"
          className="text-decoration-none link-light"
        >
          {content}
        </a>
      ) : (
        content
      )}
    </div>
  );
}

QuotationCard.propTypes = {
  name: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  bio: PropTypes.string,
  imageUrl: PropTypes.string,
  link: PropTypes.string,
};

QuotationCard.defaultProps = {
  bio: '',
  imageUrl: '',
  link: '',
};

export default QuotationCard;

function QuotationCardContent({ text, name, bio, imageUrl, link }) {
  return (
    <div className="ac-quotation-card-content">
      {imageUrl && (
        <div className="ac-quotation-card-picture">
          <img
            src={imageUrl}
            alt={name}
            className="d-inline rounded-circle border-dark img-fluid"
          />
        </div>
      )}

      <p>
        {text}
        {link && (
          <FaChevronRight className="ac-text-accent ac-text-accent-glow ms-1" />
        )}
      </p>

      <h5 className="fw-bold fs-6">{name}</h5>
      {bio && <p className="fw-light fs-6">{bio}</p>}

      <div className="ac-quotation-card-icon">
        <FaQuoteLeft />
      </div>
      <div className="ac-quotation-card-icon-big">
        <FaQuoteRight />
      </div>
    </div>
  );
}

QuotationCardContent.propTypes = {
  name: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  bio: PropTypes.string,
  imageUrl: PropTypes.string,
  link: PropTypes.string,
};

QuotationCardContent.defaultProps = {
  bio: '',
  imageUrl: '',
  link: '',
};
