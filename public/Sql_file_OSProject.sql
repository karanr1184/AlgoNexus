use project_os;
create table new_table(
id int AUTO_INCREMENT,
title varchar(100),
body TEXT,
created_at DATE,
PRIMARY KEY (id)
);

use project_os;
create table sjf_values(
avgwt float,
avgta float
);

use project_os;
create table dining_phil(
p1 int,
p2 int,
p3 int,
p4 int,
p5 int
);

create table Look_Clook(
diskSize int,
headPos int
);

create table FIFO(
frames int,
hitrate float,
faultrate float
);

-- delete from Look_Clook;
use project_os;
select * from sjf_values;
select * from dining_phil;
select * from Look_Clook;
select * from FIFO;