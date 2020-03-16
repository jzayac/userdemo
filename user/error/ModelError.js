class ModelError extends Error {
  constructor(message, status, body, previousError = null) {
    super(message, status, body, previousError);
    this.name = 'ModelError';
  }
}

module.exports = ModelError;
