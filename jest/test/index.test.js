import { createUser, getUser, sum } from '../src'

test("sum(1,3) must be 3", () => {
  expect(sum(1, 2)).toBe(3);
})

test("getUser() must include an id and a username", () => {
  expect(getUser()).toEqual({
    "id": "1",
    "username": "John Doe",
  });
})

test.todo("create mock test");

test("test mock async return resolved", async () => {
  const addToDatabase = jest.fn();
  addToDatabase.mockImplementation((data) => {
    return new Promise((resolves) => {
      setTimeout(() => {
        resolves({
          status: 'success',
          data
        })
      }, 1000);
    });
  })

  await expect(createUser('John', "johndoe", addToDatabase)).resolves.toEqual({
    status: 'success'
  });
  await expect(addToDatabase.mock.results[0].value).resolves.toEqual({
    status: 'success',
    data: {
      id: addToDatabase.mock.calls[0][0].id,
      createdAt: addToDatabase.mock.calls[0][0].createdAt,
      username: "John",
      password: "johndoe"
    }
  })
})