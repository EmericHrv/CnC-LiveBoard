export const sendJsonResponse = (res, statusCode, data) => {
    res.setHeader('Content-Type', 'application/json');
    res.status(statusCode).send(JSON.stringify(data, null, 2));
};
