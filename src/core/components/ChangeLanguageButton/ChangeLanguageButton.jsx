import './ChangeLanguageButton.scss';

import React from 'react';
import { useI18next } from 'gatsby-plugin-react-i18next/dist';
import { MdLanguage } from '@react-icons/all-files/md/MdLanguage';
import classNames from 'classnames';

function ChangeLanguageButton({ className }) {
  const { changeLanguage, language, languages } = useI18next();

  const handleSwitchLanguage = () => {
    const languageToSwitch =
      languages.indexOf(language) === languages.length - 1
        ? languages[0]
        : languages[language.indexOf(language) + 1];
    changeLanguage(languageToSwitch);
  };

  return (
    <button
      type="button"
      className={classNames('btn d-flex align-items-center', className)}
      onClick={handleSwitchLanguage}
    >
      <MdLanguage />
      <span className="ms-1">{language.toUpperCase()}</span>
    </button>
  );
}

ChangeLanguageButton.propTypes = {};

ChangeLanguageButton.defaultProps = {};

export default ChangeLanguageButton;
