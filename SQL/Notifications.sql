CREATE TABLE NOTIFICATIONS (
    NOTI_ID NUMBER PRIMARY KEY,
    USER_ID NUMBER NOT NULL,
    NOTI_TYPE CHAR(1) NOT NULL,
    REVIEW_ID NUMBER NOT NULL,
    ACTION_USER_ID NUMBER NOT NULL,
    COMMENT_ID NUMBER,
    IS_READ NUMBER (1,0) DEFAULT 0,
    CREATED_AT DATE DEFAULT SYSDATE, 
    CONSTRAINT FK_NOTI_USER FOREIGN KEY(USER_ID) REFERENCES USERS(USER_ID) ON DELETE CASCADE,
    CONSTRAINT FK_NOTI_REVIEW FOREIGN KEY (REVIEW_ID) REFERENCES REVIEWS(REVIEW_ID) ON DELETE CASCADE,
    CONSTRAINT FK_NOTI_ACTOR FOREIGN KEY (ACTION_USER_ID) REFERENCES USERS(USER_ID) ON DELETE CASCADE,
    CONSTRAINT FK_NOTI_COMMENT FOREIGN KEY (COMMENT_ID) REFERENCES COMMENTS(COMM_ID) ON DELETE CASCADE,
    CONSTRAINT CHECK_NOTI_TYPE CHECK (NOTI_TYPE IN ('C', 'U', 'D')));
    

CREATE INDEX IDX_NOTI_USER_CREATED ON NOTIFICATIONS(USER_ID, CREATED_AT DESC);


CREATE SEQUENCE NOTIFICATION_SEQ START WITH 1 INCREMENT BY 1;


CREATE OR REPLACE TRIGGER TRG_NOTI_COMMENT
AFTER INSERT ON COMMENTS
FOR EACH ROW
DECLARE
    v_review_owner NUMBER;
    v_notif_count NUMBER;
BEGIN
    --GETS OWNER OF THE REVIEW
    SELECT USER_ID INTO v_review_owner
    FROM REVIEWS
    WHERE REVIEW_ID = :NEW.REVIEW_ID;
    
    --NO NOTI IF USER COMMENTS THEIR OWN REVIEW
    IF v_review_owner != :NEW.USER_ID THEN
    
    --NOTI AMOUNT CHECK
    SELECT COUNT(*) INTO v_notif_count
    FROM NOTIFICATIONS
    WHERE USER_ID = v_review_owner;
    
    --DELETE LOGIC
    IF v_notif_count >= 5 THEN
        DELETE FROM NOTIFICATIONS
        WHERE NOTI_ID = (
            SELECT NOTI_ID
            FROM NOTIFICATIONS
            WHERE USER_ID = v_review_owner
            ORDER BY CREATED_AT ASC
            FETCH FIRST 1 ROW ONLY
        );
    END IF;
    
    --NEW NOTI INSERTION
    INSERT INTO NOTIFICATIONS(
        NOTI_ID,
        USER_ID,
        NOTI_TYPE,
        REVIEW_ID,
        ACTION_USER_ID,
        COMMENT_ID,
        IS_READ,
        CREATED_AT
        )VALUES(
            NOTIFICATION_SEQ.NEXTVAL,
            v_review_owner,
            'C',
            :NEW.REVIEW_ID,
            :NEW.USER_ID,
            :NEW.COMM_ID,
            0,
            SYSDATE
        );
    END IF;
EXCEPTION
    WHEN OTHERS THEN
    NULL;
END;
/

CREATE OR REPLACE TRIGGER TRG_NOTI_VOTE
AFTER INSERT ON USER_VOTE
FOR EACH ROW
DECLARE
    v_review_owner NUMBER;
    v_notif_count NUMBER;
    v_vote_type CHAR(1);
BEGIN
    --GETS IF IT IS AN UPVOTE OR DOWNVOTE
    v_vote_type := CASE WHEN :NEW.VOTE_TYPE = 'U' THEN 'U' ELSE 'D' END;
    
    --GETS OWNER OF REVIEW
    SELECT USER_ID INTO v_review_owner
    FROM REVIEWS
    WHERE REVIEW_ID = :NEW.VOTE_ID;
    
    --NO NOTI IF USER VOTES THEIR OWN REVIEW
    IF v_review_owner != :NEW.USER_ID THEN
    
    --NOTI AMOUNT CHECK
    SELECT COUNT(*) INTO v_notif_count
    FROM NOTIFICATIONS
    WHERE USER_ID = v_review_owner;
    
    --DELETE LOGIC
    IF v_notif_count >=5 THEN
        DELETE FROM NOTIFICATIONS
        WHERE NOTI_ID = (
            SELECT NOTI_ID
            FROM NOTIFICATIONS
            WHERE USER_ID = v_review_owner
            ORDER BY CREATED_AT ASC
            FETCH FIRST 1 ROW ONLY
        );
    END IF;
    
    --NEW NOTI INSERTION
    INSERT INTO NOTIFICATIONS(
        NOTI_ID,
        USER_ID,
        NOTI_TYPE,
        REVIEW_ID,
        ACTION_USER_ID,
        COMMENT_ID,
        IS_READ,
        CREATED_AT
        )VALUES(
            NOTIFICATION_SEQ.NEXTVAL,
            v_review_owner,
            v_vote_type,
            :NEW.VOTE_ID,
            :NEW.USER_ID,
            NULL,
            0,
            SYSDATE
        );
    END IF;
EXCEPTION
    WHEN OTHERS THEN
    NULL;
END;
    


--READ NOTI DELETE LOGIC(7 DAYS)

BEGIN
    DBMS_SCHEDULER.CREATE_JOB (
        job_name => 'DELETE_OLD_READ_NOTIFICATIONS',
        job_type => 'PLSQL_BLOCK',
        job_action => 'BEGIN
                        DELETE FROM NOTIFICATIONS
                        WHERE IS_READ = 1
                        AND CREATED_AT < SYSDATE - 7;
                        COMMIT;
                        END;',
        start_date => SYSTIMESTAMP,
        repeat_interval => 'FREQ=DAILY; BYHOUR=3; BYMINUTE=0; BYSECOND=0',
        enabled => TRUE,
        comments => 'Deletes read notification older than 7 days'
        );
END;

--DELETE OLD NOTI AFTER 30 DAYS

BEGIN
    DBMS_SCHEDULER.CREATE_JOB (
        job_name => 'DELETE_OLDEST_NOTIFICATIONS',
        job_type => 'PLSQL_BLOCK',
        job_action => 'BEGIN
                        DELETE FROM NOTIFICATIONS
                        WHERE CREATED_AT < SYSDATE - 30;
                        COMMIT;
                        END;',
        start_date => SYSTIMESTAMP,
        repeat_interval => 'FREQ=DAILY; BYHOUR=4; BYMINUTE=0; BYSECOND=0',
        enabled => TRUE,
        comments => 'Deletes ALL notification older than 30 days'
        );
END;    
    
    
--ORPHAN NOTI DELETE LOGIC(7 DAYS)

BEGIN
    DBMS_SCHEDULER.CREATE_JOB (
        job_name => 'DELETE_ORPHAN_NOTIFICATIONS',
        job_type => 'PLSQL_BLOCK',
        job_action => 'BEGIN
                        DELETE FROM NOTIFICATIONS n
                        WHERE NOT EXISTS (
                            SELECT 1 FROM REVIEWS r
                            WHERE r.REVIEW_ID = n.REVIEW_ID
                        );
                        COMMIT;
                        END;',
        start_date => SYSTIMESTAMP,
        repeat_interval => 'FREQ=WEEKLY; BYDAY=SUN; BYHOUR=2; BYMINUTE=0',
        enabled => TRUE,
        comments => 'CLEANUP ORPHAN NOTI WEEKLY'
        );
END;    
    
    
    
GRANT ALL ON ADMIN.NOTIFICATIONS TO Andrew;
GRANT ALL ON ADMIN.NOTIFICATION_SEQ TO Andrew;
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    