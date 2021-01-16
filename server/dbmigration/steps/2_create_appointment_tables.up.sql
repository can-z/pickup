create table location (
    id TEXT,
    address TEXT,
    note TEXT,
    PRIMARY KEY (id)
);

create table appointment (
    id TEXT, 
    location_id TEXT, 
    time INTEGER,
    PRIMARY KEY (id)
    FOREIGN KEY(location_id) REFERENCES location(id)
);