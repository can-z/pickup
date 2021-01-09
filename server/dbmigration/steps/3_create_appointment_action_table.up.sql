create table appointment_action (
    id TEXT, 
    appointment_id TEXT, 
    customer_id TEXT,
    created_at INTEGER,
    action_type INTEGER,
    PRIMARY KEY (id)
    FOREIGN KEY(appointment_id) REFERENCES appointment(id)
    FOREIGN KEY(customer_id) REFERENCES customer(id)
);