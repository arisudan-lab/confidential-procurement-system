import pino from 'pino';
const logger = pino();
export function errorHandler(err, req, res, next) {
    logger.error({ err }, 'Unhandled exception');
    res.status(500).json({
        error: 'Internal Server Error',
        message: err?.message || 'Unknown error occurred'
    });
}
