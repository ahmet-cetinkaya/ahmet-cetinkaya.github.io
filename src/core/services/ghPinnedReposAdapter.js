import axios from 'axios';
import ErrorDataResult from '../models/result/errorDataResult';
import SuccessDataResult from '../models/result/successDataResult';

export default class GhPinnedReposAdapter {
  #apiUrl;

  #http;

  constructor(apiUrl) {
    this.#apiUrl = apiUrl;
    this.#http = axios.create({
      baseURL: this.#apiUrl,
    });
  }

  async getPinnedRepos(userName) {
    const pinnedReposResponse = await this.#http.get('', {
      params: {
        username: userName,
      },
    });

    if (pinnedReposResponse.status !== 200)
      return new ErrorDataResult('errorFetchingPinnedGithubRepos');

    return new SuccessDataResult(
      'githubPinnedReposListed',
      pinnedReposResponse.data
    );
  }
}
