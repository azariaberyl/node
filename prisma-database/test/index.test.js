import { PrismaClient } from '@prisma/client';
import prismaClient from '../src/prisma-client.js';

const data1 = {
  id: 'Johnwick',
  name: 'John',
  email: 'john@gmail.com',
  phone: '081234567890',
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
});

describe('Prisma CRUD ORM operation', () => {
  test('Create operation', async () => {
    const customer = await prismaClient.customer.create({
      data: {
        id: 'Johnwick',
        name: 'John',
        email: 'john@gmail.com',
        phone: '081234567890',
      },
    });

    expect(customer.email).toBe('john@gmail.com');
    expect(customer.id).toBe('Johnwick');
    expect(customer.name).toBe('John');
    expect(customer.phone).toBe('081234567890');
  });

  test('Update operation', async () => {
    const customer = await prismaClient.customer.update({
      data: {
        name: 'John Wick',
      },
      where: {
        id: 'Johnwick',
      },
    });

    expect(customer.name).toBe('John Wick');
  });

  test('Read operation', async () => {
    const customer = await prismaClient.customer.findUnique({
      where: {
        id: 'Johnwick',
      },
    });

    expect(customer.email).toBe('john@gmail.com');
    expect(customer.id).toBe('Johnwick');
    expect(customer.name).toBe('John Wick');
    expect(customer.phone).toBe('081234567890');
  });

  test('Delete operation', async () => {
    const customer = await prismaClient.customer.delete({
      where: {
        id: 'Johnwick',
      },
    });

    expect(customer.email).toBe('john@gmail.com');
    expect(customer.id).toBe('Johnwick');
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

test.todo('One to one');
test.todo('One to many');
test.todo('many to many');
