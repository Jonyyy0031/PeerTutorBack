export class AppError extends Error {
    constructor(
      public message: string,
      public statusCode: number = 500,
      public code?: string
    ) {
      super(message);
      this.name = this.constructor.name;
    }
  }

  export class ValidationError extends AppError {
    constructor(message: string) {
      super(message, 400, 'VALIDATION_ERROR');
    }
  }

  export class NotFoundError extends AppError {
    constructor(message: string) {
      super(message, 404, 'NOT_FOUND');
    }
  }

  export class DatabaseError extends AppError {
    constructor(message: string) {
      super(message, 500, 'DATABASE_ERROR');
    }
  }