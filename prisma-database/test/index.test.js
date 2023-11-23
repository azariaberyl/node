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
});

test('Query SQL', async () => {
  const id = 1;

  const samples = await prismaClient.$queryRaw`SELECT * FROM sample WHERE id = ${id}`;
  console.log(samples);
});

describe.only('Prisma CRUD ORM operation', () => {
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
