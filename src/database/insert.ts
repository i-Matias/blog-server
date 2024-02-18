const insertUser = `INSERT INTO users (username, email, password) VALUES (?, ?, ?)`;
const insertToPost = `INSERT INTO posts (title, content, created, user_id) VALUES (?, ?, ?, ?)`;
const insertToImg = `INSERT INTO images (alt, img_data, post_id) VALUES (?, ?, ?)`;
const insertToPost_Tags = `INSERT INTO post_tags (post_id, tag_id) VALUES (?, ?)`;

export { insertUser, insertToPost, insertToImg, insertToPost_Tags };
