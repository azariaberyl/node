CREATE TABLE comments (
    id varchar(191) NOT NULL,
    customer_id varchar(191) NOT NULL,
    title varchar(191),
    description varchar(191),
    CONSTRAINT comments_customer_id_fk FOREIGN KEY (customer_id) REFERENCES customers(id)
);

INSERT INTO comments (id, customer_id, title, description) VALUES
('101', '1', 'First Comment by John', 'This is the description of John\'s first comment.'),
('102', '1', 'Second Comment by John', 'This is the description of John\'s second comment.'),
('201', '2', 'First Comment by Jane', 'This is the description of Jane\'s first comment.'),
('202', '2', 'Second Comment by Jane', 'This is the description of Jane\'s second comment.');


-- Add Customer 1
INSERT INTO customers (id, name, email, phone) VALUES
('1', 'John Doe', 'john@example.com', '123-456-7890');

-- Add Customer 2
INSERT INTO customers (id, name, email, phone) VALUES
('2', 'Jane Smith', 'jane@example.com', '987-654-3210');

CREATE TABLE likes (
    customer_id varchar(191),
    product_id int,
    PRIMARY KEY (customer_id, product_id),
    CONSTRAINT likes_customer_id_fk FOREIGN KEY (customer_id) REFERENCES customers (id),
    CONSTRAINT likes_product_id_fk FOREIGN KEY (product_id) REFERENCES products (id)
) ENGINE innodb;

CREATE TABLE _loves (
    A varchar(191),
    B int,
    PRIMARY KEY (A, B),
    CONSTRAINT customer_loves_fk FOREIGN KEY (A) REFERENCES customers (id),
    CONSTRAINT product_loves_fk FOREIGN KEY (B) REFERENCES products (id)
) ENGINE innodb;