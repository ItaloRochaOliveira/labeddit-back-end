import { BaseError } from "./BaseError";

export class NotFound extends BaseError {
  constructor(message = "Não foi possivel encontrar o item.") {
    super(404, message);
  }
}
