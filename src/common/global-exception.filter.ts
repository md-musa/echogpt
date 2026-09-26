import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(GlobalExceptionFilter.name);

    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const res = ctx.getResponse<Response>();

        // Prisma known errors
        if (exception?.name === 'PrismaClientKnownRequestError' || typeof exception?.code === 'string') {
            const code = exception.code as string | undefined;
            let status = HttpStatus.BAD_REQUEST;
            let message = 'A database error occurred. Please try again.';

            if (code === 'P2002') {
                status = HttpStatus.CONFLICT;
                message = 'That value is already in use. Please choose a different one.';
            } else if (code === 'P2003') {
                status = HttpStatus.BAD_REQUEST;
                message = 'The related record was not found. Please check your input and try again.';
            } else if (code === 'P2025') {
                status = HttpStatus.NOT_FOUND;
                message = 'The item you are trying to access does not exist.';
            }

            this.logger.warn(`Prisma error ${code}: ${exception?.message}`);
            res.status(status).json({ status, message });
            return;
        }

        // Nest HTTP exceptions
        if (exception instanceof HttpException) {
            const status = exception.getStatus();
            const response = exception.getResponse();

            let message = 'An error occurred.';
            if (typeof response === 'string') {
                message = response;
            } else if (typeof response === 'object' && response !== null) {
                if ('message' in response) {
                    const responseMessage = (response as any).message;
                    if (Array.isArray(responseMessage)) {
                        message = responseMessage.join(', ');
                    } else if (typeof responseMessage === 'string') {
                        message = responseMessage;
                    } else {
                        message = JSON.stringify(responseMessage);
                    }
                } else if ('error' in response) {
                    message = (response as any).error as string;
                } else {
                    message = JSON.stringify(response);
                }
            }

            res.status(status).json({ status, message });
            return;
        }

        // Fallback for unexpected errors
        this.logger.error('Unexpected error', exception?.stack ?? exception);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            message: 'An unexpected error occurred',
        });
    }
}
