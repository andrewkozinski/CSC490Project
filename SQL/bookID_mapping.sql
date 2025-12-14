CREATE TABLE bookID_mapping(
    book_id NUMBER GENERATED ALWAYS AS IDENTITY START WITH 1 INCREMENT BY 1 PRIMARY KEY,
    book_str VARCHAR2(200) NOT NULL UNIQUE
);


CREATE OR REPLACE FUNCTION get_book_id(api_book_str VARCHAR2)
RETURN NUMBER
IS
    v_num NUMBER;
BEGIN
    BEGIN
        SELECT book_id INTO v_num
        FROM bookID_mapping
        WHERE book_str = api_book_str;
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            BEGIN
                INSERT INTO bookID_mapping(book_str)
                VALUES(api_book_str)
                RETURNING book_id INTO v_num;
            EXCEPTION
                WHEN DUP_VAL_ON_INDEX THEN
                    SELECT book_id INTO v_num
                    FROM bookID_mapping
                    WHERE book_str = api_book_str;
            END;
            
    END;
    RETURN v_num;
END;
/

CREATE OR REPLACE FUNCTION get_book_str(seq_num NUMBER)
RETURN VARCHAR2
IS
    v_str VARCHAR2(200);
BEGIN
    SELECT book_str INTO v_str
    FROM bookID_mapping
    WHERE book_id = seq_num;
    
    RETURN v_str;
EXCEPTION
    WHEN NO_DATA_FOUND THEN
        RETURN NULL;
END;