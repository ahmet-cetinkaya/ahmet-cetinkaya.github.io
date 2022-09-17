import Result from './result';

export default class ErrorResult extends Result {
  constructor(message) {
    super(false);
    this.message = message;
  }
}
