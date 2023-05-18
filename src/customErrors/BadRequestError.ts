import { BaseError } from "./BaseError";

export class BadRequestError extends BaseError {
  constructor(message = "Requisição invalida.") {
    super(400, message);
  }
}
