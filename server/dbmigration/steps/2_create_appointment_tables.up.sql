create table location (
    id TEXT,
    address TEXT,
    note TEXT,
    PRIMARY KEY (id)
);

create table appointment (
    id TEXT, 
    location_id TEXT, 
    start_time INTEGER,
    end_time INTEGER,
    PRIMARY KEY (id)
    FOREIGN KEY(location_id) REFERENCES location(id)
);