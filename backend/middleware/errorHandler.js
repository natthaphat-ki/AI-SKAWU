function errorHandler(err, req, res, next) {
    console.error(err);
    res.status(500).json({ error: "เกิดข้อผิดพลาดที่เซิร์ฟเวอร์" });
}

module.exports = errorHandler;
