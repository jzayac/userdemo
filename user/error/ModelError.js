class ModelError extends Error {
  constructor(message, status, errorCode) {
    super(message, status, errorCode);
    this.name = 'ModelError';
  }
}

module.exports = ModelError;
