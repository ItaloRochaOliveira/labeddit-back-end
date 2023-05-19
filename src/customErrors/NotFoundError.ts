import { BaseError } from "./BaseError";

export class NotFoundError extends BaseError {
  constructor(message = "Não foi possivel encontrar o item.") {
    super(404, message);
  }
}
