SET NAMES utf8mb4;
USE vending;

CREATE TABLE IF NOT EXISTS products (
  id INT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  category VARCHAR(50) NOT NULL,
  price INT NOT NULL,
  stock INT NOT NULL,
  emoji VARCHAR(10) NOT NULL,
  description VARCHAR(255) NOT NULL,
  image VARCHAR(255) NOT NULL
);

INSERT INTO products (id, name, category, price, stock, emoji, description, image) VALUES
(1, 'Matte Lipstick', 'lip', 129, 8, '💄', 'ลิปสติกเนื้อแมตต์ สีชัด ติดทนนาน', 'images/product-1.jpg'),
(2, 'Lip Gloss', 'lip', 149, 6, '💋', 'ลิปกลอสเพิ่มความฉ่ำวาว', 'images/product-2.jpg'),
(3, 'Blush', 'cheek', 159, 5, '🌸', 'บลัชออน สีสวยเป็นธรรมชาติ', 'images/product-3.jpg'),
(4, 'Eyeshadow', 'eye', 189, 4, '👁️', 'อายแชโดว์ โทนสีสวย', 'images/product-4.jpg'),
(5, 'Mascara', 'eye', 199, 7, '🖤', 'มาสคาร่า เพิ่มความยาว', 'images/product-5.jpg'),
(6, 'Foundation', 'face', 299, 3, '🧴', 'รองพื้น ปกปิดเนียน', 'images/product-6.jpg'),
(7, 'Highlighter', 'cheek', 179, 5, '✨', 'ไฮไลท์ เพิ่มมิติให้ใบหน้า', 'images/product-7.jpg'),
(8, 'Nail Polish', 'nail', 99, 10, '💅', 'ยาทาเล็บ สีสวย ติดทน', 'images/product-8.jpg'),
(9, 'Eyeliner', 'eye', 139, 9, '🖊️', 'อายไลเนอร์ เส้นคมชัด กันน้ำ', 'images/product-9.jpg'),
(10, 'BB Cream', 'face', 259, 6, '🧪', 'บีบีครีม ปกปิดเบาสบายผิว', 'images/product-10.jpg');
