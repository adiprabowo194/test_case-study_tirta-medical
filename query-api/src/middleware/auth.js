import 'dotenv/config';

const authMiddleware = (req, res, next) => {
    const authHeader = req.header('Authorization');
    const expectedApiKey = `API-KEY ${process.env.MY_API_KEY}`;

    // Validasi API-KEY
    if (!authHeader || authHeader !== expectedApiKey) {
        return res.status(401).json({
            message: "Unauthorized"
        });
    }

    // Ambil token setelah kata "API-KEY "
    // const apiKey = authHeader.split(' ')[1];

    // Bandingkan dengan API-KEY yang ada di .env
    //if (apiKey !== process.env.MY_API_KEY) {
    // return res.status(401).json({
    //message: "Unauthorized"
    // });
    // }

    // Jika valid, lanjut ke proses berikutnya
    next();
};

export default authMiddleware;