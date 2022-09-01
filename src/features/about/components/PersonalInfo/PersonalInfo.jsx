import './PersonalInfo.scss';

import React from 'react';
import {useI18next} from 'gatsby-plugin-react-i18next';

function PersonalInfo() {
  const {t} = useI18next();

  const personalInformationFields = [
    {
      name: t('firstName'),
      info: 'Ahmet',
    },
    {
      name: t('lastName'),
      info: 'Çetinkaya',
    },
    {
      name: t('age'),
      info: (new Date().getFullYear() - 1999 - 1).toString(),
    },
    {
      name: t('email'),
      info: 'ahmetcetinkaya7@outlook.com',
    },
    {
      name: t('languages'),
      info: `${t('turkish')}, ${t('english')}`,
    },
    {
      name: t('location'),
      info: `${t('turkey')}, Antalya`,
    },
  ];

  return (
    <>
      {personalInformationFields.map(field => (
        <div className="mb-3 overflow-auto">
          <span className="ac-text-accent">{field.name}</span>
          <span className="fw-light ms-3">{field.info}</span>
        </div>
      ))}
    </>
  );
}

PersonalInfo.propTypes = {};

PersonalInfo.defaultProps = {};

export default PersonalInfo;
