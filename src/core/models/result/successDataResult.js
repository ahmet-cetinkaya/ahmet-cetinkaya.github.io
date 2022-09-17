import SuccessResult from './successResult';

export default class SuccessDataResult extends SuccessResult {
  constructor(message, data) {
    super(message);
    this.data = data;
  }
}
