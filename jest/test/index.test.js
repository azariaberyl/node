import { getUser, sum } from '../src'

test("sum(1,3) must be 3", () => {
  expect(sum(1, 2)).toBe(3);
})

test("getUser() must include an id and a username", () => {
  expect(getUser()).toEqual({
    "id": "1",
    "username": "John Doe",
  });
})