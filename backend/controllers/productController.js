const pool = require("../db");

async function getProducts(req, res, next) {
    try {
        const [rows] = await pool.query("SELECT * FROM products ORDER BY id");
        res.json(rows);
    } catch (err) {
        next(err);
    }
}

async function purchaseProducts(req, res, next) {
    const { items } = req.body;
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        for (const item of items) {
            const [rows] = await connection.query(
                "SELECT stock FROM products WHERE id = ? FOR UPDATE",
                [item.id]
            );
            if (rows.length === 0 || rows[0].stock < item.quantity) {
                await connection.rollback();
                return res.status(400).json({ error: `สินค้ารหัส ${item.id} มีไม่พอ` });
            }
        }

        for (const item of items) {
            await connection.query(
                "UPDATE products SET stock = stock - ? WHERE id = ?",
                [item.quantity, item.id]
            );
        }

        await connection.commit();
        const [rows] = await pool.query("SELECT * FROM products ORDER BY id");
        res.json({ success: true, products: rows });
    } catch (err) {
        await connection.rollback();
        next(err);
    } finally {
        connection.release();
    }
}

module.exports = { getProducts, purchaseProducts };
