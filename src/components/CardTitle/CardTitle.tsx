import React, { Component } from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';

interface Props extends WithTranslation {
  title: string;
  secondTitle: string;
}

class CardTitle extends Component<Props> {
  render() {
    const { t, title, secondTitle } = this.props;

    return (
      <header id='title' className='position-relative text-uppercase text-center mt-2 mb-5'>
        <h1 className='fw-bold m-0 text-accent'>{t(title)}</h1>
        <span className='fw-bold bg-text'>{t(secondTitle)}</span>
      </header>
    );
  }
}

export default withTranslation()(CardTitle);
