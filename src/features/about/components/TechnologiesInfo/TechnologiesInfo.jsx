import './TechnologiesInfo.scss';

import {SiCsharp} from '@react-icons/all-files/si/SiCsharp';
import {SiDotNet} from '@react-icons/all-files/si/SiDotNet';
import {SiJavascript} from '@react-icons/all-files/si/SiJavascript';
import {SiTypescript} from '@react-icons/all-files/si/SiTypescript';
import {SiNodeDotJs} from '@react-icons/all-files/si/SiNodeDotJs';
import {SiReact} from '@react-icons/all-files/si/SiReact';
import {SiAngular} from '@react-icons/all-files/si/SiAngular';
import {SiJava} from '@react-icons/all-files/si/SiJava';
import {SiSpring} from '@react-icons/all-files/si/SiSpring';
import {SiMicrosoftsqlserver} from '@react-icons/all-files/si/SiMicrosoftsqlserver';
import {SiMysql} from '@react-icons/all-files/si/SiMysql';
import {SiPostgresql} from '@react-icons/all-files/si/SiPostgresql';
import {SiMongodb} from '@react-icons/all-files/si/SiMongodb';
import {SiAmazonaws} from '@react-icons/all-files/si/SiAmazonaws';
import {SiDart} from '@react-icons/all-files/si/SiDart';
import {SiFlutter} from '@react-icons/all-files/si/SiFlutter';
import {SiUnity} from '@react-icons/all-files/si/SiUnity';
import {SiAdobe} from '@react-icons/all-files/si/SiAdobe';
import React from 'react';
import {useI18next} from 'gatsby-plugin-react-i18next';
import IconLabel from '../../../../core/components/IconLabel/IconLabel';
import Title from '../../../../shared/components/Title/Title';

function TechnologiesInfo() {
  const {t} = useI18next();

  const technologiesInfoFields = [
    {
      icon: <SiCsharp color="#67217A" />,
      name: 'C#',
    },
    {
      icon: <SiDotNet color="#5C2D91" />,
      name: 'ASP.NET',
    },
    {
      icon: <SiJava color="#ED8B00" />,
      name: 'Java',
    },
    {
      icon: <SiSpring color="#6DB33F" />,
      name: 'Spring',
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
      icon: <SiNodeDotJs color="#43853D" />,
      name: 'NodeJS',
    },
    {
      icon: <SiReact color="#5FD4F4" />,
      name: 'React',
    },
    {
      icon: <SiAngular color="#DD0031" />,
      name: 'Angular',
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
      <Title title={t('technologiesIUse')} />
      {technologiesInfoFields.map(field => (
        <IconLabel
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
