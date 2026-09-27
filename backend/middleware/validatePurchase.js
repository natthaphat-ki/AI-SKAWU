function validatePurchase(req, res, next) {
    const { items } = req.body;
    if (!Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ error: "ไม่มีสินค้าในตะกร้า" });
    }
    for (const item of items) {
        if (!item.id || !item.quantity || item.quantity <= 0) {
            return res.status(400).json({ error: "ข้อมูลสินค้าไม่ถูกต้อง" });
        }
    }
    next();
}

module.exports = validatePurchase;
