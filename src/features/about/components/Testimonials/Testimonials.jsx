import './Testimonials.scss';

import React from 'react';
import { useI18next } from 'gatsby-plugin-react-i18next';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import classNames from 'classnames';
import Title from '../../../../shared/components/Title/Title';
import IconButton from '../../../../core/components/IconButton/IconButton';
import QuotationCard from '../QuotationCard/QuotationCard';
import locales from '../../../../shared/constants/localesKeys';

function Testimonials() {
  const { t } = useI18next();
  const testimonials = [
    {
      name: 'Engin Demiroğ',
      text: t(locales.about.testimonialEnginDemirog),
      bio: 'Founder @Kodlamaio, Co-Founder @SolidTeam & DevArchitecture, Consultant & Instructor',
      imageUrl:
        'https://user-images.githubusercontent.com/53148314/128637071-044413c4-4b4d-4ff1-b996-69e890cd4050.jpg',
      link: 'https://www.linkedin.com/posts/engindemirog_yaz%C4%B1l%C4%B1m-geli%C5%9Ftirici-yeti%C5%9Ftirme-kamp%C4%B1nda-paralel-activity-6784383328754663424-QkpG',
    },
  ];

  return (
    <>
      <div className="d-flex align-items-end">
        <Title title={t(locales.about.testimonials)} className="mb-3 mt-5" />
        <div className="d-flex align-items-end ms-3 mb-3">
          <IconButton
            icon={<FaChevronLeft size="1.3rem" />}
            data-bs-target="#testimonialsCarousel"
            data-bs-slide="prev"
          />
          <IconButton
            icon={<FaChevronRight size="1.3rem" />}
            data-bs-target="#testimonialsCarousel"
            data-bs-slide="next"
          />
        </div>
      </div>

      <div
        id="testimonialsCarousel"
        className="carousel slide d-flex justify-content-center"
        data-bs-ride="carousel"
      >
        <div className="carousel-indicators">
          {testimonials.map(({ name }, index) => (
            <button
              key={name}
              type="button"
              data-bs-target="#testimonialsCarousel"
              data-bs-slide-to={index}
              className={classNames({ active: index === 0 })}
              aria-current="true"
              aria-label={`${name} ${t(locales.about.testimonial)}`}
            />
          ))}
        </div>

        <div className="carousel-inner ac-testimonial-carousel-inner">
          {testimonials.map(({ name, text, bio, imageUrl, link }, index) => (
            <div
              key={name}
              className={classNames('carousel-item', {
                active: index === 0,
              })}
              data-bs-interval="4000"
            >
              <QuotationCard
                name={name}
                text={text}
                bio={bio}
                imageUrl={imageUrl}
                link={link}
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

Testimonials.propTypes = {};

Testimonials.defaultProps = {};

export default Testimonials;
