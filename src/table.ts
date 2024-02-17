const user = `CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(16) NOT NULL,
    email VARCHAR(32) NOT NULL,
    password VARCHAR(64) NOT NULL
    );`;

const tag = `CREATE TABLE IF NOT EXISTS tags (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(16) NOT NULL
    );`;

const post = `CREATE TABLE IF NOT EXISTS posts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(16) NOT NULL,
    content VARCHAR(1024) NOT NULL,
    date DATE NOT NULL,
    user_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE
    );`;

const post_tag = `CREATE TABLE IF NOT EXISTS post_tags (
    post_id INT,
    tag_id INT,
    FOREIGN KEY (post_id) REFERENCES posts(id),
    FOREIGN KEY (tag_id) REFERENCES tags(id)
    );`;

const img = `CREATE TABLE IF NOT EXISTS images (
     id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(16) NOT NULL,
    data BLOB NOT NULL,
    post_id INT NOT NULL,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE ON UPDATE CASCADE
    );`;

export { user, post, tag, post_tag, img };
