import ErrorResult from './errorResult';

export default class ErrorDataResult extends ErrorResult {
  constructor(message, data = null) {
    super(message);
    this.data = data;
  }
}
