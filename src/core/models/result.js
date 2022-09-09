class Result {
  constructor(isSuccess, message) {
    this.isSuccess = isSuccess;
    this.message = message;
  }
}

export class SuccessResult extends Result {
  constructor(message) {
    super(true);
    this.message = message;
  }
}

export class ErrorResult extends Result {
  constructor(message) {
    super(false);
    this.message = message;
  }
}

export class SuccessDataResult extends SuccessResult {
  constructor(message, data) {
    super(message);
    this.data = data;
  }
}

export class ErrorDataResult extends ErrorResult {
  constructor(message, data = null) {
    super(message);
    this.data = data;
  }
}
