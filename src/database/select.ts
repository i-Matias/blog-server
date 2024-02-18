const selectAllPosts = `SELECT u.username, p.title, p.content, p.created, t.tag_name, img.alt, img.img_data
                        FROM users u
                        INNER JOIN posts p ON u.id = p.user_id
                        INNER JOIN post_tags pt ON p.id = pt.post_id
                        INNER JOIN tags t ON pt.tag_id = t.id
                        INNER JOIN images img ON p.id = img.post_id
                        LIMIT 10
                        `;

const selectAllPostsWithoutUserId = `SELECT u.username, p.title, p.content, p.created, t.tag_name, img.alt, img.img_data
                                    FROM users u
                                    INNER JOIN posts p ON u.id = p.user_id
                                    INNER JOIN post_tags pt ON p.id = pt.post_id
                                    INNER JOIN tags t ON pt.tag_id = t.id
                                    INNER JOIN images img ON p.id = img.post_id
                                    WHERE u.id != ?
                                    LIMIT 10`;

const selectTag = `SELECT * FROM tags WHERE tag_name = ?`;

export { selectAllPosts, selectAllPostsWithoutUserId, selectTag };
