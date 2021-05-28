import React, { Component } from 'react';
import CardTitle from '../../components/CardTitle/CardTitle';
import Carousel from '../../components/Carousel/Carousel';
import QuotationCard from '../../components/QuotationCard/QuotationCard';
import SocialButtons from '../../components/SocialButtons/SocialButtons';

import { withTranslation, WithTranslation } from 'react-i18next';
import {
  Csharp,
  Html5,
  Java,
  Javascript,
  Typescript,
  Sass,
  ReactJs,
  Angular,
  NodeDotJs,
  DotNet,
  Spring,
  Unity,
  Adobephotoshop,
  Adobeillustrator,
  Mongodb,
  Microsoftsqlserver,
  Postgresql,
  Adobepremierepro,
  Adobeaftereffects,
} from '@icons-pack/react-simple-icons';

import './About.scss';

class About extends Component<WithTranslation> {
  PersonalInfoField(props: { name: string; info: string }) {
    return (
      <div className='mb-3 overflow-auto'>
        <span className='text-accent'>{props.name}</span>
        <span className='fw-light ms-3'>{props.info}</span>
      </div>
    );
  }

  TechnologyInfoField(props: { icon: JSX.Element; name: string }): JSX.Element {
    return (
      <span className='technology-info-field d-inline bg-dark rounded p-2 me-2 mb-3'>
        {props.icon}
        <span className='fw-light ms-2'>{props.name}</span>
      </span>
    );
  }

  Title(props: { name: string }): JSX.Element {
    return <h2 className='fs-2 fw-light mt-5 pt-4 mb-3'>{props.name}</h2>;
  }

  getAge(): number {
    return new Date().getFullYear() - 1999 - 1;
  }

  render(): JSX.Element {
    const { PersonalInfoField, TechnologyInfoField, Title, getAge } = this;
    const { t } = this.props;

    return (
      <div className='row'>
        <CardTitle title={t('about-me')} secondTitle={t('resume')} />
        <div className='row'>
          <div className='col-xxl-8 px-5'>
            <p>{t('bio')}</p>
            <span className='d-flex justify-content-center mt-2'>
              <SocialButtons className='fs-3' />
            </span>
          </div>
          <div className='d-flex justify-content-center col-xxl-4 mt-3 mt-xxl-0'>
            <div>
              <PersonalInfoField name={t('first-name')} info='Ahmet' />
              <PersonalInfoField name={t('last-name')} info='Çetinkaya' />
              <PersonalInfoField name={t('age')} info={getAge().toString()} />
              <PersonalInfoField name={t('email')} info='ahmet4cetinkaya@outlook.com' />
              <PersonalInfoField name={t('langages')} info={`${t('turkish')}, ${t('english')}`} />
              <PersonalInfoField name={t('address')} info={`Antalya, ${t('turkey')}`} />
            </div>
          </div>
        </div>

        <Title name={t('technologies-i-use')} />
        <TechnologyInfoField icon={<Javascript color='#F0D91E' />} name='Javascript' />
        <TechnologyInfoField icon={<Typescript color='#3075C1' />} name='Typescript' />
        <TechnologyInfoField icon={<Csharp color='#67217A' />} name='C#' />
        <TechnologyInfoField icon={<Java color='#ED8B00' />} name='Java' />
        <TechnologyInfoField icon={<Html5 color='#E34F26' />} name='HTML' />
        <TechnologyInfoField icon={<Sass color='#CC6699' />} name='SCSS' />
        <TechnologyInfoField icon={<ReactJs color='#5FD4F4' />} name='React' />
        <TechnologyInfoField icon={<Angular color='#DD0031' />} name='Angular' />
        <TechnologyInfoField icon={<NodeDotJs color='#43853D' />} name='NodeJS' />
        <TechnologyInfoField icon={<DotNet color='#5C2D91' />} name='ASP.NET' />
        <TechnologyInfoField icon={<Spring color='#6DB33F' />} name='Spring' />

        <TechnologyInfoField icon={<Microsoftsqlserver color='#CC2927' />} name='MSSQL' />
        <TechnologyInfoField icon={<Postgresql color='#316192' />} name='PostgreSQL' />
        <TechnologyInfoField icon={<Mongodb color='#4EA94B' />} name='MongoDB' />

        <TechnologyInfoField icon={<Unity color='#FFF' />} name='Unity' />
        <TechnologyInfoField icon={<Adobephotoshop color='#31A8FF' />} name='Photoshop' />
        <TechnologyInfoField icon={<Adobeillustrator color='#FF9A00' />} name='Illustrator' />
        <TechnologyInfoField icon={<Adobepremierepro color='#9595F8' />} name='Premiere' />
        <TechnologyInfoField icon={<Adobeaftereffects color='#CD8DF8' />} name='After Effects' />

        <Title name={t('testimonials')} />
        <Carousel id='testimonials-slider' carouselControl={false}>
          <div className='row'>
            <div className='col'>
              <QuotationCard
                text={t('testimonial-engindemirog')}
                name='Engin Demiroğ'
                imageUrl='https://media-exp1.licdn.com/dms/image/C4D03AQE8n8PM_nk31g/profile-displayphoto-shrink_200_200/0/1571218237185?e=1627516800&v=beta&t=uPfgAS5UK8NxCwJadfIF5CXKn9rxSbcFT5z42EODUUc'
                link='https://www.linkedin.com/posts/engindemirog_yaz%C4%B1l%C4%B1m-geli%C5%9Ftirici-yeti%C5%9Ftirme-kamp%C4%B1nda-paralel-activity-6784383328754663424-QkpG'
              />
            </div>
            <div className='col'></div>
          </div>
        </Carousel>
      </div>
    );
  }
}

export default withTranslation()(About);
