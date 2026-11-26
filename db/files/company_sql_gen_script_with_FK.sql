CREATE TABLE DEPARTMENT  (
        dname           varchar(15)     not null,
        dnumber         int             not null,
        mgr_ssn         char(9)         not null,
        mgr_start       date,
    primary key (dnumber),
    unique (dname)
);
INSERT INTO DEPARTMENT VALUES('Research',5,'333445555','1988-05-22');
INSERT INTO DEPARTMENT VALUES('Administration',4,'987654321','1995-01-01');
INSERT INTO DEPARTMENT VALUES('Headquarters',1,'888665555','1981-06-19');
CREATE TABLE DEPT_LOCATIONS (
        dnumber          int                not null,
        dlocation        varchar(15)        not null,
    primary key (dnumber, dlocation),
    foreign key (dnumber) references DEPARTMENT(dnumber)
);
INSERT INTO DEPT_LOCATIONS VALUES(1,'Houston');
INSERT INTO DEPT_LOCATIONS VALUES(4,'Stafford');
INSERT INTO DEPT_LOCATIONS VALUES(5,'Bellaire');
INSERT INTO DEPT_LOCATIONS VALUES(5,'Sugarland');
INSERT INTO DEPT_LOCATIONS VALUES(5,'Houston');

CREATE TABLE EMPLOYEE (
        fname             varchar(15)         not null,
        minit             char, 
        lname             varchar(15)         not null,
        ssn               char(9)             not null,
        bdate             DATE,
        address           varchar(30), 
        sex               char, 
        salary            decimal(10,2),
        super_ssn         char(9),
        dno               int                 not null,
    primary key (ssn),
    foreign key (dno) references DEPARTMENT(dnumber)
);
INSERT INTO EMPLOYEE VALUES('James','E','Borg','888665555','1937-11-10','450 Stone, Houston TX','M',55000,NULL,1);
INSERT INTO EMPLOYEE VALUES('John','B','Smith','123456789','1965-01-09','731 Fondren, Houston TX','M',30000,'333445555',5);
INSERT INTO EMPLOYEE VALUES('Franklin','T','Wong','333445555','1955-12-08','638 Voss, Houston TX','M',40000,'888665555',5);
INSERT INTO EMPLOYEE VALUES('Alicia','J','Zelaya','999887777','1968-01-19','3321 Castle, Spring TX','F',25000,'987654321',4);
INSERT INTO EMPLOYEE VALUES('Jennifer','S','Wallace','987654321','1941-06-20','291 Berry, Bellaire TX','F',43000,'888665555',4);
INSERT INTO EMPLOYEE VALUES('Ramesh','K','Narayan','666884444','1962-09-15','975 Fire Oak, Humble TX','M',38000,'333445555',5);
INSERT INTO EMPLOYEE VALUES('Joyce','A','English','453453453','1972-07-31','5631 Rice, Houston TX','F',25000,'333445555',5);
INSERT INTO EMPLOYEE VALUES('Ahmad','V','Jabbar','987987987','1969-03-29','980 Dallas, Houston TX','M',25000,'987654321',4);

ALTER TABLE EMPLOYEE 
ADD CONSTRAINT fk_super_ssn
FOREIGN KEY (super_ssn) REFERENCES EMPLOYEE (ssn);

ALTER TABLE DEPARTMENT 
ADD CONSTRAINT fk_mgr_ssn
FOREIGN KEY (mgr_ssn) REFERENCES EMPLOYEE (ssn);


CREATE TABLE PROJECT (
        pname            varchar(15)        not null,
        pnumber          int                not null,
        plocation        varchar(15),
        dnum             int                not null,
    primary key (pnumber),
    unique (pname),
    foreign key (dnum) references DEPARTMENT(dnumber)
);
INSERT INTO PROJECT VALUES('ProductX',1,'Bellaire',5);
INSERT INTO PROJECT VALUES('ProductY',2,'Sugarland',5);
INSERT INTO PROJECT VALUES('ProductZ',3,'Houston',5);
INSERT INTO PROJECT VALUES('Computerization',10,'Stafford',4);
INSERT INTO PROJECT VALUES('Reorganization',20,'Houston',1);
INSERT INTO PROJECT VALUES('Newbenefits',30,'Stafford',4);
CREATE TABLE WORKS_ON (
        essn               char(9)            not null,
        pno                int                not null,
        hours              decimal(3,1)       ,
    primary key (essn, pno),
    foreign key (essn) references EMPLOYEE(ssn),
    foreign key (pno) references PROJECT(pnumber)
);
INSERT INTO WORKS_ON VALUES('123456789',1,32.5);
INSERT INTO WORKS_ON VALUES('123456789',2,7.5);
INSERT INTO WORKS_ON VALUES('666884444',3,40);
INSERT INTO WORKS_ON VALUES('453453453',1,20);
INSERT INTO WORKS_ON VALUES('453453453',2,20);
INSERT INTO WORKS_ON VALUES('333445555',2,10);
INSERT INTO WORKS_ON VALUES('333445555',3,10);
INSERT INTO WORKS_ON VALUES('333445555',10,10);
INSERT INTO WORKS_ON VALUES('333445555',20,10);
INSERT INTO WORKS_ON VALUES('999887777',30,30);
INSERT INTO WORKS_ON VALUES('999887777',10,10);
INSERT INTO WORKS_ON VALUES('987987987',10,35);
INSERT INTO WORKS_ON VALUES('987987987',30,5);
INSERT INTO WORKS_ON VALUES('987654321',30,20);
INSERT INTO WORKS_ON VALUES('987654321',20,15);
INSERT INTO WORKS_ON VALUES('888665555',20,NULL);
CREATE TABLE DEPENDENT (
        essn               char(9)            not null,
        DEPENDENT_name     varchar(15)        not null,
        sex                char,
        bdate              date,
        relationship       varchar(8),
    primary key (essn, DEPENDENT_name),
    foreign key (essn) references EMPLOYEE (ssn)
);
INSERT INTO DEPENDENT VALUES('333445555','Alice','F','1986-04-05','daughter');
INSERT INTO DEPENDENT VALUES('333445555','Theodore','M','1983-10-25','son');
INSERT INTO DEPENDENT VALUES('333445555','Joy','F','1958-05-03','spouse');
INSERT INTO DEPENDENT VALUES('987654321','Abner','M','1942-02-28','spouse');
INSERT INTO DEPENDENT VALUES('123456789','Michael','M','1988-01-04','son');
INSERT INTO DEPENDENT VALUES('123456789','Alice','F','1988-12-30','daughter');
INSERT INTO DEPENDENT VALUES('123456789','Elizabeth','F','1967-05-05','spouse');
COMMIT;
