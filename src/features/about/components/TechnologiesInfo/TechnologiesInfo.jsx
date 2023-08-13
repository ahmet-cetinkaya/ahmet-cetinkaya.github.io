import './TechnologiesInfo.scss';

import {
  SiCsharp,
  SiDotnet,
  SiJavascript,
  SiTypescript,
  SiNodedotjs,
  SiAngular,
  SiReact,
  SiDart,
  SiFlutter,
  SiSpring,
  SiPhp,
  SiLaravel,
  SiMicrosoftsqlserver,
  SiMysql,
  SiPostgresql,
  SiMongodb,
  SiAmazonaws,
  SiUnity,
  SiAdobe,
} from 'react-icons/si';
import React from 'react';
import { useI18next } from 'gatsby-plugin-react-i18next';
import Label from '../../../../core/components/Label/Label';
import Title from '../../../../shared/components/Title/Title';
import locales from '../../../../shared/constants/localesKeys';
import { FaJava } from 'react-icons/fa';

function TechnologiesInfo() {
  const { t } = useI18next();

  const technologiesInfoFields = [
    {
      icon: <SiCsharp color="#67217A" />,
      name: 'C#',
    },
    {
      icon: <SiDotnet color="#5C2D91" />,
      name: 'ASP.NET',
    },
    {
      icon: <SiJavascript color="#F0D91E" />,
      name: 'Javascript',
    },
    {
      icon: <SiTypescript color="#3075C1" />,
      name: 'Typescript',
    },
    {
      icon: <SiNodedotjs color="#43853D" />,
      name: 'NodeJS',
    },
    {
      icon: <SiAngular color="#DD0031" />,
      name: 'Angular',
    },
    {
      icon: <SiReact color="#5FD4F4" />,
      name: 'React',
    },
    {
      icon: <SiDart color="#0175C2" />,
      name: 'Dart',
    },
    {
      icon: <SiFlutter color="#02569B" />,
      name: 'Flutter',
    },
    {
      icon: <FaJava color="#ED8B00" />,
      name: 'Java',
    },
    {
      icon: <SiSpring color="#6DB33F" />,
      name: 'Spring',
    },
    {
      icon: <SiPhp color="#777BB4" />,
      name: 'PHP',
    },
    {
      icon: <SiLaravel color="#FF2D20" />,
      name: 'Laravel',
    },
    {
      icon: <SiMicrosoftsqlserver color="#CC2927" />,
      name: 'MSSQL',
    },
    {
      icon: <SiMysql color="#4479A1" />,
      name: 'MySQL',
    },
    {
      icon: <SiPostgresql color="#316192" />,
      name: 'PostgreSQL',
    },
    {
      icon: <SiMongodb color="#4EA94B" />,
      name: 'MongoDB',
    },
    {
      icon: <SiAmazonaws color="#0175C2" />,
      name: 'AWS',
    },
    {
      icon: <SiUnity color="#FFF" />,
      name: 'Unity',
    },
    {
      icon: <SiAdobe color="#FF0000" />,
      name: 'Adobe Utils',
    },
  ];

  return (
    <>
      <Title title={t(locales.about.technologiesIUse)} className="mb-3 mt-5" />
      {technologiesInfoFields.map((field) => (
        <Label
          key={field.name}
          icon={field.icon}
          name={field.name}
          className="ac-bg-dark-color-2 rounded"
        />
      ))}
    </>
  );
}

TechnologiesInfo.propTypes = {};

TechnologiesInfo.defaultProps = {};

export default TechnologiesInfo;
