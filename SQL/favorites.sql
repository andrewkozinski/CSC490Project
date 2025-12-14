CREATE TABLE favorites(
    fav_id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id NUMBER NOT NULL REFERENCES USERS(user_id),
    media_id NUMBER NOT NULL,
    media_type  VARCHAR2(100) NOT NULL,
    CONSTRAINT unique_user_favorite UNIQUE(user_id, media_id, media_type)
);

CREATE TABLE book_mapping_favorites(
    fav_book_id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    fav_book_str VARCHAR2(200) NOT NULL UNIQUE
);

CREATE INDEX idx_fav_book_str ON book_mapping_favorites(fav_book_str);


CREATE OR REPLACE FUNCTION get_fav_book_id(p_book_str VARCHAR2)
RETURN NUMBER
IS
    v_id NUMBER;
    PRAGMA AUTONOMOUS_TRANSACTION;
BEGIN
    SELECT fav_book_id INTO v_id
    FROM book_mapping_favorites
    WHERE fav_book_str = p_book_str;
    RETURN v_id;
EXCEPTION
    WHEN NO_DATA_FOUND THEN
        INSERT INTO book_mapping_favorites(fav_book_str)
        VALUES(p_book_str)
        RETURNING fav_book_id INTO v_id;
        COMMIT;
        RETURN v_id;
    WHEN DUP_VAL_ON_INDEX THEN
        SELECT fav_book_id INTO v_id
        FROM book_mapping_favorites
        WHERE fav_book_str = p_book_str;
        RETURN v_id;
END;
/

CREATE OR REPLACE FUNCTION get_fav_book_str(p_book_id NUMBER)
RETURN VARCHAR2
IS
    v_str VARCHAR2(200);
BEGIN
    SELECT fav_book_str INTO v_str
    FROM book_mapping_favorites
    WHERE fav_book_id = p_book_id;
    RETURN v_str;
EXCEPTION
    WHEN NO_DATA_FOUND THEN
        RETURN NULL;
END;
/


GRANT ALL ON ADMIN.favorites TO Andrew;
GRANT ALL ON ADMIN.book_mapping_favorites TO Andrew;
GRANT ALL ON ADMIN.favorites TO Joseph;
GRANT ALL ON ADMIN.book_mapping_favorites TO Joseph;



DROP VIEW Andrew.favorites;
CREATE VIEW Andrew.favorites AS
SELECT
    fav_id,
    user_id,
    media_id,
    media_type
FROM ADMIN.favorites;

DROP VIEW Andrew.book_mapping_favorites;
CREATE VIEW Andrew.book_mapping_favorites AS
SELECT
    fav_book_id,
    fav_book_str
FROM ADMIN.book_mapping_favorites;


CREATE VIEW Joseph.favorites AS
SELECT
    fav_id,
    user_id,
    media_id,
    media_type
FROM ADMIN.favorites;


DROP VIEW Joseph.book_mapping_favorites;
CREATE VIEW Joseph.book_mapping_favorites AS
SELECT
    fav_book_id,
    fav_book_str
FROM ADMIN.book_mapping_favorites;
























