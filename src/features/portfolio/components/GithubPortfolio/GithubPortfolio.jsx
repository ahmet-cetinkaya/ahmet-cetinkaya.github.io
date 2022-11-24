import './GithubPortfolio.scss';

import React, { useEffect, useRef, useState } from 'react';

import GhPinnedReposAdapter from '../../../../core/services/ghPinnedReposAdapter';
import GithubApiAdapter from '../../../../core/services/githubApiAdapter';
import GithubRepoCard from '../../../../core/components/GithubRepoCard/GithubRepoCard';
import PropTypes from 'prop-types';
import { SiGithub } from '@react-icons/all-files/si/SiGithub';
import Title from '../../../../shared/components/Title/Title';
import classNames from 'classnames';
import locales from '../../../../shared/constants/localesKeys';
import { useI18next } from 'gatsby-plugin-react-i18next';

function GithubPortfolio({ personal, instruction, options }) {
  const customFilterTypes = {
    pinned: 'pinned',
  };
  const customSortTypes = {
    stars: 'starts',
  };

  const firstTabRef = useRef(null);
  const [elasticNavPillBackgroundStyle, setElasticNavPillBackgroundStyle] =
    useState({ top: 0, left: 0, width: 0 });
  const [currentFilterAndSort, setCurrentFilterAndSort] = useState({
    label: locales.portfolio.pinned,
    filterType: customFilterTypes.pinned,
    sortType: null,
  });
  const [personalGithubRepos, setPersonalGithubRepos] = useState(null);
  const [instructionGithubRepos, setinstructionGithubRepos] = useState(null);
  const [pinnedRepoUrls, setPinnedRepoUrls] = useState([]);
  const [error, setError] = useState(null);
  const [loadingCount, setLoadingCount] = useState(0);

  const githubApiAdapter = new GithubApiAdapter(
    process.env.GATSBY_GITHUB_API_URL
  );
  const ghPinnedReposAdapter = new GhPinnedReposAdapter(
    process.env.GATSBY_GH_PINNED_REPOS_API_URL
  );
  const { t } = useI18next();

  const tabs = [
    {
      id: 'personal',
      name: t(locales.portfolio.personal),
      owner: personal,
      repos: personalGithubRepos
        ? personalGithubRepos.filter((repo) => !repo.isFork)
        : null,
      viewAllUrl: `https://github.com/${personal.userName}?tab=repositories`,
    },
    {
      id: 'iContributed',
      name: t(locales.portfolio.contribute),
      owner: personal,
      repos: personalGithubRepos
        ? personalGithubRepos.filter((repo) => repo.isFork)
        : null,
      viewAllUrl: `https://github.com/${personal.userName}?tab=repositories`,
    },
    {
      id: 'instruction',
      name: t(locales.portfolio.instruction),
      owner: instruction,
      repos: instructionGithubRepos,
      viewAllUrl: `https://github.com/orgs/${instruction.userName}/repositories`,
    },
  ];
  const handleFilterAndSortClick = (
    labelLocaleKey,
    { sortType, filterType } = {}
  ) => {
    setCurrentFilterAndSort({ label: labelLocaleKey, sortType, filterType });
  };
  const filterAndSortOptions = [
    {
      name: t(locales.portfolio.pinned),
      onClick: () =>
        handleFilterAndSortClick(locales.portfolio.pinned, {
          filterType: customFilterTypes.pinned,
        }),
    },
    {
      name: t(locales.portfolio.mostSupported),
      onClick: () =>
        handleFilterAndSortClick(locales.portfolio.mostSupported, {
          sortType: customSortTypes.stars,
        }),
    },
    {
      name: t(locales.portfolio.recent),
      onClick: () =>
        handleFilterAndSortClick(locales.portfolio.recent, {
          sortType: GithubApiAdapter.repoSortTypes.pushed,
        }),
    },
  ];

  const getPinnedReposByUser = async (userName) => {
    setLoadingCount((prev) => prev + 1);

    const ghPinnedReposAdapterResponse =
      await ghPinnedReposAdapter.getPinnedRepos(userName);
    if (!ghPinnedReposAdapterResponse.isSuccess) {
      setError(ghPinnedReposAdapterResponse.message);
      setLoadingCount((prev) => prev - 1);
      return;
    }

    setPinnedRepoUrls((prev) =>
      prev.concat(
        ghPinnedReposAdapterResponse.data.map((pinnedRepo) => pinnedRepo.link)
      )
    );
    setLoadingCount((prev) => prev - 1);
  };
  const getAllGithubReposByUser = async (
    userName,
    userType,
    setStateCallback
  ) => {
    setLoadingCount((prev) => prev + 1);

    const githubReposResponse = await githubApiAdapter.getRepos(
      userName,
      userType
    );

    setLoadingCount((prev) => prev - 1);

    if (!githubReposResponse.isSuccess) {
      setError(githubReposResponse.message);
      return;
    }
    setStateCallback(githubReposResponse.data);
  };
  const getAllGithubTabsRepos = () => {
    tabs.forEach((tab) => {
      if (tab.id === 'iContributed') return;

      const setStateCallback =
        tab.id === 'personal'
          ? setPersonalGithubRepos
          : setinstructionGithubRepos;
      getAllGithubReposByUser(
        tab.owner.userName,
        tab.owner.userType,
        setStateCallback
      );
      getPinnedReposByUser(tab.owner.userName);
    });
  };
  const filterAndSortRepos = (repos) => {
    let filteredAndSortedRepos = [...repos];
    filteredAndSortedRepos = filteredAndSortedRepos.filter(
      (repo) => !options.ignoreUrls.includes(repo.url)
    );

    switch (currentFilterAndSort.filterType) {
      case customFilterTypes.pinned:
        if (
          !filteredAndSortedRepos.some((repo) =>
            pinnedRepoUrls.includes(repo.url)
          )
        )
          break;

        filteredAndSortedRepos = filteredAndSortedRepos.filter((repo) =>
          pinnedRepoUrls.includes(repo.url)
        );
        break;
      default:
        break;
    }

    switch (currentFilterAndSort.sortType) {
      case customSortTypes.stars:
        filteredAndSortedRepos = filteredAndSortedRepos.sort(
          (a, b) => b.stargazerCount - a.stargazerCount
        );
        break;
      case GithubApiAdapter.repoSortTypes.pushed:
        filteredAndSortedRepos = filteredAndSortedRepos.sort(
          (a, b) => new Date(b.pushedAt) - new Date(a.pushedAt)
        );
        break;
      default:
        break;
    }

    return filteredAndSortedRepos.slice(0, 6);
  };
  const moveElasticNavPillBackground = (e) => {
    setElasticNavPillBackgroundStyle({
      top: `${e.target.offsetTop}px`,
      left: `${e.target.offsetLeft}px`,
      width: `${e.target.offsetWidth}px`,
    });
  };

  useEffect(() => {
    moveElasticNavPillBackground({ target: firstTabRef.current });
    getAllGithubTabsRepos();
  }, []);

  return (
    <>
      <Title title={t(locales.portfolio.projects)} className="mb-3" />
      <div className="ac-github-portfolio">
        <div className="d-sm-flex justify-content-between">
          <ul
            className="nav mb-3 position-relative"
            id="ac-github-portfolio"
            role="tablist"
          >
            <div
              className="ac-elastic-nav-pill-background"
              style={elasticNavPillBackgroundStyle}
            />
            {tabs.map((tab, index) => (
              <li key={tab.id} className="nav-item" role="presentation">
                <button
                  ref={index === 0 ? firstTabRef : null}
                  onClick={moveElasticNavPillBackground}
                  className={classNames('nav-link btn border-0', {
                    active: index === 0,
                  })}
                  id={`ac-${tab.id}-repos-tab"`}
                  data-bs-toggle="pill"
                  data-bs-target={`#ac-${tab.id}-repos`}
                  type="button"
                  role="tab"
                  aria-controls={`ac-${tab.id}-repos`}
                  aria-selected="true"
                >
                  {tab.name}
                </button>
              </li>
            ))}
          </ul>

          <div className="dropdown mb-3 mb-sm-0">
            <button
              className="btn btn-outline-primary dropdown-toggle"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              {t(currentFilterAndSort.label)}
            </button>
            <ul className="dropdown-menu ac-bg-dark-color-2">
              {filterAndSortOptions.map((filterOption) => (
                <li key={filterOption.name}>
                  <button
                    type="button"
                    className="dropdown-item text-light"
                    onClick={filterOption.onClick}
                  >
                    {filterOption.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="tab-content" id="ac-github-portfolioContent">
          {!error &&
            tabs.map((tab, tabIndex) => (
              <div
                key={tab.id}
                className={classNames('tab-pane fade', {
                  'show active': tabIndex === 0,
                })}
                id={`ac-${tab.id}-repos`}
                role="tabpanel"
                aria-labelledby={`ac-${tab.id}-repos-tab`}
                tabIndex={0}
              >
                <div className="row">
                  {tab.repos &&
                    (loadingCount
                      ? new Array(6).fill(null)
                      : filterAndSortRepos(tab.repos)
                    ).map((repo) => (
                      <GithubRepoCard
                        key={repo ? repo.name : Math.random()}
                        githubRepoModel={repo}
                        className={{
                          containerClassName: 'col-lg-6 mb-4',
                          cardClassName: 'border-dark',
                        }}
                        isLoading={!repo}
                      />
                    ))}
                </div>
                <a
                  href={tab.viewAllUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-outline-primary"
                >
                  <SiGithub />
                  <span className="mx-5">{t(locales.index.viewAll)}</span>
                </a>
              </div>
            ))}
          {error && (
            <div className="alert alert-danger" role="alert">
              {t(error)}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

GithubPortfolio.propTypes = {
  personal: PropTypes.shape({
    userName: PropTypes.string.isRequired,
    userType: PropTypes.string.isRequired,
  }).isRequired,
  forks: PropTypes.shape({
    userName: PropTypes.string.isRequired,
    userType: PropTypes.string.isRequired,
  }).isRequired,
  options: PropTypes.shape({
    ignoreUrls: PropTypes.arrayOf(PropTypes.string),
  }),
};

GithubPortfolio.defaultProps = {
  options: {
    ignoreUrls: [],
  },
};

export default GithubPortfolio;
