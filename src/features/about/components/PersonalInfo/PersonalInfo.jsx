import './PersonalInfo.scss';

import React from 'react';
import { useI18next } from 'gatsby-plugin-react-i18next';
import locales from '../../../../shared/constants/localesKeys';
import Obfuscate from 'react-obfuscate';

function PersonalInfo() {
  const { t } = useI18next();

  const personalInformationFields = [
    {
      name: t(locales.index.firstName),
      info: 'Ahmet',
    },
    {
      name: t(locales.index.lastName),
      info: 'Çetinkaya',
    },
    {
      name: t(locales.index.age),
      info: (new Date().getFullYear() - 1999 - 1).toString(),
    },
    {
      name: t(locales.index.email),
      info: 'ahmetcetinkaya7@outlook.com',
    },
    {
      name: t(locales.index.languages),
      info: `${t(locales.index.turkish)}, ${t(locales.index.english)}`,
    },
    {
      name: t(locales.index.location),
      info: `${t(locales.index.turkey)}, Antalya`,
    },
  ];

  return (
    <>
      {personalInformationFields.map((field) => (
        <div key={field.name} className="mb-3 overflow-auto">
          <span className="ac-text-accent">{field.name}</span>
          <span className="fw-light ms-3">
            {field.name === t(locales.index.email) ? (
              <Obfuscate email={field.info} />
            ) : (
              field.info
            )}
          </span>
        </div>
      ))}
    </>
  );
}

PersonalInfo.propTypes = {};

PersonalInfo.defaultProps = {};

export default PersonalInfo;
