import { PrismaClient } from '@prisma/client';
import prismaClient from '../src/prisma-client.js';

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

describe.only('Transaction', () => {
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
