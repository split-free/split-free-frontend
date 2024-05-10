CREATE OR REPLACE FUNCTION search_friends(keyword_input TEXT, profile_id_input UUID, limit_input INT DEFAULT 10, offset_input INT DEFAULT 0)
RETURNS TABLE (
    id UUID,
    email TEXT,
    friend_status TEXT
) AS
$$
BEGIN
    RETURN QUERY
    SELECT p.id,
           p.email,
           CASE
               WHEN f.friend = profile_id_input THEN 'FRIEND'
               WHEN p.profile_id = profile_id_input THEN 'SELF'
               ELSE 'AVAILABLE'
           END AS friend_status
    FROM profiles p
    LEFT JOIN friends f ON f.friend = p.profile_id
    WHERE p.email ILIKE keyword_input || '%'
    LIMIT limit_input
    OFFSET offset_input;
END;
$$
LANGUAGE plpgsql;