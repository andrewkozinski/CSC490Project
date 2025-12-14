CREATE OR REPLACE FUNCTION get_book_id(api_book_str VARCHAR2)
RETURN NUMBER
IS
    v_num NUMBER;
    PRAGMA AUTONOMOUS_TRANSACTION;
BEGIN
    SELECT book_id INTO v_num
    FROM bookID_mapping
    WHERE book_str = api_book_str;
    
    return v_num;
EXCEPTION
    WHEN NO_DATA_FOUND THEN
        INSERT INTO bookID_mapping(book_str)
        VALUES(api_book_str)
        RETURNING book_id INTO v_num;
        COMMIT;
        RETURN v_num;
    WHEN DUP_VAL_ON_INDEX THEN
        SELECT book_id INTO v_num
        FROM bookID_mapping
        WHERE book_str = api_book_str;
        RETURN v_num;
END;
/

