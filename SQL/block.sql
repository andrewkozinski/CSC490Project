CREATE TABLE BLOCK(
    user_id NUMBER NOT NULL REFERENCES USERS(user_id),
    blocked_user_id NUMBER NOT NULL REFERENCES USERS(user_id),
    PRIMARY KEY(user_id, blocked_user_id),
    CONSTRAINT check_no_self_block CHECK (user_id != blocked_user_id)
);

GRANT ALL ON ADMIN.BLOCK TO Andrew;
GRANT ALL ON ADMIN.BLOCK TO Joseph;
