import { PrismaClient } from '@prisma/client';
import prismaClient from '../src/prisma-client.js';

const data1 = {
  id: 'Johnwick',
  name: 'John',
  email: 'john0@gmail.com',
  phone: '081234567891',
};
const data2 = {
  id: 'Johnwick1',
  name: 'John1',
  email: 'john1@gmail.com',
  phone: '081234534890',
};
beforeEach(async () => {
  await prismaClient.customer.createMany({
    data: [data1, data2],
  });
});

afterEach(async () => {
  await prismaClient.customer.deleteMany({
    where: {
      id: {
        contains: 'Johnwick',
      },
    },
  });
});

test.skip('Prisma Client', async () => {
  const primsa = new PrismaClient();
  await primsa.$connect();

  // Do something

  await primsa.$disconnect();
});

test('Execute SQL', async () => {
  const id = 1;
  const name = 'John';

  const impacted = await prismaClient.$executeRaw`INSERT INTO sample (id, name) VALUES (${id}, ${name})`;
  console.log(impacted);
  await prismaClient.$executeRaw`DELETE FROM sample WHERE ${id}`;
});

test('Query SQL', async () => {
  const name = 'John';
  const id = 1;

  await prismaClient.$executeRaw`INSERT INTO sample (id, name) VALUES (${id}, ${name})`;
  const samples = await prismaClient.$queryRaw`SELECT * FROM sample WHERE id = ${id}`;
  console.log(samples);
  await prismaClient.$executeRaw`DELETE FROM sample WHERE ${id}`;
});

describe('Prisma CRUD ORM operation', () => {
  test('Create operation', async () => {
    const customer = await prismaClient.customer.create({
      data: {
        id: 'Johnwic',
        name: 'John',
        email: 'john@gmail.com',
        phone: '081234567890',
      },
    });

    expect(customer.email).toBe('john@gmail.com');
    expect(customer.id).toBe('Johnwic');
    expect(customer.name).toBe('John');
    expect(customer.phone).toBe('081234567890');
  });

  test('Update operation', async () => {
    const customer = await prismaClient.customer.update({
      data: {
        name: 'John Wick',
      },
      where: {
        id: 'Johnwic',
      },
    });

    expect(customer.name).toBe('John Wick');
  });

  test('Read operation', async () => {
    const customer = await prismaClient.customer.findUnique({
      where: {
        id: 'Johnwic',
      },
    });

    expect(customer.email).toBe('john@gmail.com');
    expect(customer.id).toBe('Johnwic');
    expect(customer.name).toBe('John Wick');
    expect(customer.phone).toBe('081234567890');
  });

  test('Delete operation', async () => {
    const customer = await prismaClient.customer.delete({
      where: {
        id: 'Johnwic',
      },
    });

    expect(customer.email).toBe('john@gmail.com');
    expect(customer.id).toBe('Johnwic');
    expect(customer.name).toBe('John Wick');
    expect(customer.phone).toBe('081234567890');
  });
});

test('Tag function', async () => {
  const name = 'John';
  const id = 1;
  function tagFunction(array, ...args) {
    console.log(array);
    console.log(args);
  }

  tagFunction`Hello ${name}, your id is ${id}`;
});

describe('Transaction', () => {
  test('Sequential transaction', async () => {
    const insertedData = {
      email: 'jane@gmail.com',
      id: 'jane',
      name: 'Jane',
      phone: '309213829',
    };
    const result = await prismaClient.$transaction([
      prismaClient.customer.create({
        data: insertedData,
      }),
      prismaClient.customer.delete({
        where: {
          id: insertedData.id,
        },
      }),
    ]);

    console.log(result);
    expect(result[0]).toEqual(insertedData);
    expect(result[1]).toEqual(insertedData);
  });

  test('Interactive transaction', async () => {
    const insertedData = {
      email: 'jane@gmail.com',
      id: 'jane',
      name: 'Jane',
      phone: '309213829',
    };

    const result = await prismaClient.$transaction(async (prisma) => {
      const createJane = await prisma.customer.create({
        data: insertedData,
      });

      const delJane = await prisma.customer.delete({
        where: {
          id: insertedData.id,
        },
      });

      return [createJane, delJane];
    });

    expect(result[0]).toEqual(insertedData);
    expect(result[1]).toEqual(insertedData);
  });
});

describe('CRUD Many', () => {
  const createdData1 = {
    email: 'jane@gmail.com',
    id: 'jane',
    name: 'Jane',
    phone: '7349801293',
  };

  const createdData2 = {
    name: 'Jane1',
    email: 'jane1@gmail.com',
    id: 'Jane1',
    phone: '049320948',
  };

  test('Create many', async () => {
    const result = await prismaClient.customer.createMany({
      data: [createdData1, createdData2],
    });

    console.log(result);

    expect(result.count).toBe(2);
  });

  test('Update many', async () => {
    const result = await prismaClient.customer.updateMany({
      data: {
        name: 'Jane Doe',
      },
      where: {
        name: {
          contains: 'Jane',
        },
      },
    });

    expect(result.count).toBe(2);
  });

  test('Read many', async () => {
    const result = await prismaClient.customer.findMany({
      where: {
        name: {
          contains: 'Jane',
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    expect(result[0]).toEqual({ ...createdData1, name: 'Jane Doe' });
    expect(result[1]).toEqual({ ...createdData2, name: 'Jane Doe' });
  });
  test('Delete many', async () => {
    const result = await prismaClient.customer.deleteMany({
      where: {
        name: {
          contains: 'Jane',
        },
      },
    });

    expect(result.count).toBe(2);
  });
});

test('Pagging', async () => {
  // Skip is the how many data skipped, and take is how many data taken after that skip
  const page1 = await prismaClient.customer.findMany({
    skip: 0,
    take: 1,
  });

  const page2 = await prismaClient.customer.findMany({
    skip: 1,
    take: 1,
  });

  expect(page1[0]).toEqual(data1);
  expect(page2[0]).toEqual(data2);
});

test('Sorting', async () => {
  const result = await prismaClient.customer.findMany({
    orderBy: {
      name: 'desc',
    },
  });

  expect(result).toEqual([data2, data1]);
});

test('Select fields / columns', async () => {
  const result = await prismaClient.customer.findMany({
    select: {
      id: true,
      name: true,
    },
  });

  expect(result).toEqual([
    { id: data1.id, name: data1.name },
    { id: data2.id, name: data2.name },
  ]);
});

test('Aggregate count', async () => {
  const result = await prismaClient.customer.count({
    where: {
      name: {
        contains: 'John',
      },
    },
  });

  expect(result).toBe(2);
});

test('Aggregate', async () => {
  const result = await prismaClient.product.aggregate({
    _avg: {
      price: true,
    },
    _min: {
      price: true,
    },
    _max: {
      price: true,
    },
  });

  expect(result._avg.price).toBe(22.99);
  expect(result._min.price).toBe(9.99);
  expect(result._max.price).toBe(39.99);
});

describe('Aggregate and Group by', () => {
  test('Group by', async () => {
    const result = await prismaClient.product.groupBy({
      by: ['category'],
      _avg: {
        price: true,
      },
      _min: {
        price: true,
      },
      _max: {
        price: true,
      },
    });

    expect(result[0]).toEqual({
      _avg: { price: 14.99 },
      _min: { price: 9.99 },
      _max: { price: 19.99 },
      category: 'Electronics',
    });
    expect(result[1]).toEqual({
      _avg: { price: 34.99 },
      _min: { price: 29.99 },
      _max: { price: 39.99 },
      category: 'Clothing',
    });
  });

  test('Group by and having filter', async () => {
    const result = await prismaClient.product.groupBy({
      by: ['category'],
      _avg: {
        price: true,
      },
      _min: {
        price: true,
      },
      _max: {
        price: true,
      },
      having: {
        price: {
          _avg: {
            gt: 15,
          },
        },
      },
    });

    expect(result[0]).toEqual({
      _avg: { price: 34.99 },
      _min: { price: 29.99 },
      _max: { price: 39.99 },
      category: 'Clothing',
    });
  });
});

test('Where, filter conditions and operators', async () => {
  //https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#filter-conditions-and-operators
  const result = await prismaClient.product.findMany({
    where: {
      OR: [{ name: 'Product1' }, { name: 'Product2' }],
    },
    orderBy: {
      name: 'desc',
    },
  });

  expect(result[0]).toEqual({
    id: 2,
    name: 'Product2',
    price: 29.99,
    stock: 30,
    category: 'Clothing',
  });
  expect(result[1]).toEqual({
    id: 1,
    name: 'Product1',
    price: 19.99,
    stock: 50,
    category: 'Electronics',
  });
});

describe('One to one, customer to wallet', () => {
  afterAll(async () => {
    await prismaClient.wallet.delete({
      where: {
        id: 1,
      },
    });
    await prismaClient.customer.delete({
      where: {
        id: 'john2',
      },
    });
  });

  test('One to one, connect, with include', async () => {
    const result = await prismaClient.wallet.create({
      data: {
        id: 1,
        balance: 100_000,
        customer_id: data1.id,
      },
      include: {
        customer: true,
      },
    });

    expect(result).toEqual({ id: 1, balance: 100_000, customer_id: data1.id, customer: { ...data1 } });

    await prismaClient.wallet.delete({
      where: {
        id: 1,
      },
    });
  });

  test('One to one, create with relation', async () => {
    const result = await prismaClient.customer.create({
      data: {
        id: 'john2',
        email: 'john2@gmail.com',
        name: 'John Wick',
        phone: '0858721392183',
        wallet: {
          create: {
            id: 1,
            balance: 10000,
          },
        },
      },
      include: {
        wallet: true,
      },
    });

    expect(result).toEqual({
      id: 'john2',
      email: 'john2@gmail.com',
      name: 'John Wick',
      phone: '0858721392183',
      wallet: {
        id: 1,
        balance: 10_000,
        customer_id: 'john2',
      },
    });
  });

  test('find many with include', async () => {
    const result = await prismaClient.customer.findMany({
      where: {
        wallet: {
          isNot: null,
        },
      },
      include: {
        wallet: true,
      },
    });
    console.log(result);
  });
});

describe('One to many, customer to comments', () => {
  test('Create comment, connect with include', async () => {
    const result = await prismaClient.comment.create({
      data: {
        id: '103',
        description: 'New comment',
        title: 'Comment',
        customer_id: '1',
      },
      include: {
        customer: true,
      },
    });

    // console.log(result);
    expect(result).toEqual({
      id: '103',
      description: 'New comment',
      title: 'Comment',
      customer_id: '1',
      customer: {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        phone: '123-456-7890',
      },
    });
  });

  test('Create customer with relations', async () => {
    const result = await prismaClient.customer.create({
      data: {
        id: 'wick',
        email: 'wick@gmail.com',
        name: 'Mr Wick',
        phone: '213-849-123',
        comment: {
          createMany: {
            data: [
              { id: 'w1', description: 'New comment', title: 'Comment' },
              { id: 'w2', description: 'New comment 2', title: 'Comment 2' },
            ],
          },
        },
      },
      include: {
        comment: true,
      },
    });

    // console.log(result);
    expect(result).toEqual({
      id: 'wick',
      email: 'wick@gmail.com',
      name: 'Mr Wick',
      phone: '213-849-123',
      comment: [
        { id: 'w1', description: 'New comment', title: 'Comment', customer_id: 'wick' },
        { id: 'w2', description: 'New comment 2', title: 'Comment 2', customer_id: 'wick' },
      ],
    });
  });

  test('Find many customers based on comments', async () => {
    const result = await prismaClient.customer.findMany({
      where: {
        comment: {
          some: {
            title: {
              contains: 'Comment',
            },
          },
        },
      },
      include: {
        comment: true,
      },
    });

    expect(result[0]).toEqual({
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      phone: '123-456-7890',
      comment: [
        {
          id: '101',
          customer_id: '1',
          title: 'First Comment by John',
          description: "This is the description of John's first comment.",
        },
        {
          id: '102',
          customer_id: '1',
          title: 'Second Comment by John',
          description: "This is the description of John's second comment.",
        },
        {
          id: '103',
          description: 'New comment',
          title: 'Comment',
          customer_id: '1',
        },
      ],
    });
    expect(result[1]).toEqual({
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '987-654-3210',
      comment: [
        {
          id: '201',
          customer_id: '2',
          title: 'First Comment by Jane',
          description: "This is the description of Jane's first comment.",
        },
        {
          id: '202',
          customer_id: '2',
          title: 'Second Comment by Jane',
          description: "This is the description of Jane's second comment.",
        },
      ],
    });

    expect(result[2]).toEqual({
      id: 'wick',
      name: 'Mr Wick',
      email: 'wick@gmail.com',
      phone: '213-849-123',
      comment: [
        {
          id: 'w1',
          customer_id: 'wick',
          title: 'Comment',
          description: 'New comment',
        },
        {
          id: 'w2',
          customer_id: 'wick',
          title: 'Comment 2',
          description: 'New comment 2',
        },
      ],
    });
  });

  test('Delete comments and customers', async () => {
    const result = await prismaClient.comment.deleteMany({
      where: {
        OR: [{ customer_id: 'wick' }, { id: '103' }],
      },
    });
    const result2 = await prismaClient.customer.delete({
      where: {
        id: 'wick',
      },
    });
  });
});

describe.only('Many to many, likes, cumstomer can like many product; can be liked by many', () => {
  test('create relation, customer likes product', async () => {
    const result = await prismaClient.like.create({
      data: {
        customer_id: '1',
        product_id: 1,
      },
      include: {
        customer: true,
        product: true,
      },
    });

    expect(result).toEqual({
      customer_id: '1',
      product_id: 1,
      customer: {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        phone: '123-456-7890',
      },
      product: {
        id: 1,
        name: 'Product1',
        price: 19.99,
        stock: 50,
        category: 'Electronics',
      },
    });
  });
  test('find customer with include likes', async () => {
    const result = await prismaClient.customer.findUnique({
      where: {
        id: '1',
      },
      include: {
        likes: {
          include: {
            product: true,
          },
        },
      },
    });

    expect(result).toEqual({
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      phone: '123-456-7890',
      likes: [
        {
          customer_id: '1',
          product_id: 1,
          product: {
            category: 'Electronics',
            id: 1,
            name: 'Product1',
            price: 19.99,
            stock: 50,
          },
        },
      ],
    });
  });
  test('find customers with include like', async () => {
    const result = await prismaClient.customer.findMany({
      where: {
        likes: {
          some: {
            product: {
              name: {
                contains: 'Product',
              },
            },
          },
        },
      },
      include: {
        likes: {
          include: {
            product: true,
          },
        },
      },
    });

    console.log(result[0]);
    expect(result).toEqual([
      {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        phone: '123-456-7890',
        likes: [
          {
            customer_id: '1',
            product_id: 1,
            product: {
              category: 'Electronics',
              id: 1,
              name: 'Product1',
              price: 19.99,
              stock: 50,
            },
          },
        ],
      },
    ]);
  });

  test('delete like', async () => {
    const result = await prismaClient.like.deleteMany({
      where: { customer_id: '1' },
    });
    expect(result.count).toBe(1);
  });

  test('create implicit relation', async () => {
    const result = await prismaClient.customer.update({
      where: {
        id: '1',
      },
      data: {
        loves: {
          connect: [{ id: 1 }, { id: 2 }, { id: 3 }],
        },
      },
      include: {
        loves: true,
      },
    });

    console.log(result);
  });

  test.todo('find implicits relation');
});
