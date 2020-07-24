function errorHandeler(err, req, res, next) {
    let statusCode = '';
    let errorMessage = '';
    let errorCode = '';

    switch (err.name) {
        case "TOKEN_ERROR":
            statusCode = 400;
            errorMessage = 'Token Not Found';
            errorCode = err.name;
            break;
        case "INVALID_USER":
            statusCode = 404;
            errorMessage = 'User Not Found';
            errorCode = err.name;
            break;
        case "ERROR_DATA":
            statusCode = 404;
            errorMessage = 'Data Not Found';
            errorCode = err.name;
            break;
        case "ERROR_USER":
            statusCode = 401;
            errorMessage = 'You are not authorized ';
            errorCode = err.name;
            break;
        case "SequelizeValidationError":
            statusCode = 400;
            errorCode = 'VALIDATION_ERROR';
            const validationError = []
            
            err.errors.forEach(element => {
                validationError.push(element.message)
            });
            errorMessage = validationError;
            break;
        default:
            statusCode = "500";
            errorMessage = 'internal error server';
            errorCode = 'INTERNAL_ERROR';
            break;
    }

    res.status(statusCode).json({errorCode, message: errorMessage})
}


module.exports = errorHandeler