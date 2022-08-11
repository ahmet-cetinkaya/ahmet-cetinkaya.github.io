import './ChangeLanguageMenu.scss';

import React from 'react';
import {useI18next} from 'gatsby-plugin-react-i18next/dist';

function ChangeLanguageMenu() {
  const {languages, changeLanguage} = useI18next();

  const onChangeLanguage = (e, language) => {
    e.preventDefault();
    changeLanguage(language);
  };

  return (
    <ul className="languages">
      {languages.map(language => (
        <li key={language}>
          <button type="button" onClick={e => onChangeLanguage(e, language)}>
            {language}
          </button>
        </li>
      ))}
    </ul>
  );
}

ChangeLanguageMenu.propTypes = {};

ChangeLanguageMenu.defaultProps = {};

export default ChangeLanguageMenu;
