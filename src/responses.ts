import { Context, HonoContext } from "hono/dist/context"
import { StatusCode } from "hono/utils/http-status"

export class BaseResponse {
	isError = false
	statusCode: StatusCode = 200
	data = {}
	
	constructor(isError: boolean, data: Object, statusCode: StatusCode = 200) {
		this.isError = isError
		this.data = data
		this.statusCode = statusCode
	}

	asObject(): Object {
		return {
			isError: this.isError,
			data: this.data
		}
	}
    

    asJsonResponse(c: HonoContext | Context): Response {
        return c.json(this.asObject(), this.statusCode)
    }
}

export class OkResponse extends BaseResponse {
	constructor(data: Object) {
		super(false, data)
	}
}

export class ErrorResponse extends BaseResponse {
    errorCode = 0
    errorDetails = "Unknown error occured"
    statusCode: StatusCode = 500

	constructor (errorCode: number, errorDetails: string, statusCode: StatusCode = 500) {
        super(true, {errorCode, errorDetails}, statusCode)
    } 
}

export class NotFoundError extends ErrorResponse {
    constructor() {
        super(1, "Endpoint not found", 404)
    }
}