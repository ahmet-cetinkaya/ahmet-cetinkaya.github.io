import Result from './result';

export default class SuccessResult extends Result {
  constructor(message) {
    super(true);
    this.message = message;
  }
}
