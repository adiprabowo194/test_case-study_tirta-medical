export default (req, res, next) => {
    const authHeader = req.header('Authorization');
    const expectedApiKey = `API-KEY ${process.env.MY_API_KEY}`;

    // Validasi API-KEY
    if (!authHeader || authHeader !== expectedApiKey) {
        return res.status(401).json({
            message: "Unauthorized"
        });
    }

    next();
};