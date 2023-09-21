export function sum(a, b) {
  return a + b;
}
export function getUser() {
  return {
    "id": "1",
    "username": "John Doe",
  }
}
export async function createUser(username, password, addToDatabase) {
  const id = +new Date();
  const createdAt = new Date().toISOString();
  const result = await addToDatabase({
    id,
    createdAt,
    username,
    password
  })
  console.log(result)
  if (result.status === "success") {
    return { status: "success" }
  };
  throw new Error('Gagal membuat user baru');
}