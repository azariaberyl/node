import Joi from 'joi';

test('Basic validation', () => {
  // Create a schema/blueprint for the validation
  const schema = Joi.string().min(3).max(100).required();

  const request = 'Hello Deck';
  const minSchema = 'de';

  const reqResult = schema.validate(request);
  const minResult = schema.validate(minSchema);

  expect(reqResult.value).toBe('Hello Deck');
  expect(minResult.error).toBeDefined();
  console.log(reqResult);
  console.log(minResult);
});

test('Basic type validation', () => {
  // Create a schema/blueprint for the validation
  const strSchema = Joi.string().min(3).max(100).required();
  const numSchema = Joi.number().min(3).max(10).required();
  const boolSchema = Joi.bool().required();

  const str = 'Hello Deck';
  const num = '32894';
  const bool = 'true';

  const strResult = strSchema.validate(str);
  const numResult = numSchema.validate(num);
  const boolResult = boolSchema.validate(bool);

  expect(strResult.value).toBe('Hello Deck');
  expect(numResult.value).toBe(32894);
  expect(boolResult.value).toBe(true);
});

test('Date validation', () => {
  const birthdaySchema = Joi.date().required().max('now').min('1-1-1998');

  const result1 = birthdaySchema.validate('1-12-2015');
  const result2 = birthdaySchema.validate('1-12-1900');
  expect(result1.error).toBeUndefined();
  expect(result2.error).toBeDefined();
});

test('Validation options', () => {
  const usernameSchema = Joi.string().email().min(3).max(15);

  const result = usernameSchema.validate('12', {
    abortEarly: false,
  });

  console.log(result.error.details);
  expect(result.error).toBeDefined();
});

test('Object validation', () => {
  const loginSchema = Joi.object({
    username: Joi.string().email().max(20).required(),
    password: Joi.string().max(30).required(),
  });

  const result = loginSchema.validate({
    username: 'john',
  });
  const result1 = loginSchema.validate({
    username: 'john@gmail.com',
    password: 'sad23',
  });

  console.log(result);
  console.log(result1);

  expect(result.error).toBeDefined();
  expect(result1.error).toBeUndefined();
});

test('Array validation', () => {
  const arraySchema = Joi.array().min(1).items(Joi.string().required().min(5));

  const result = arraySchema.validate(['Hello world']);
  const result1 = arraySchema.validate([]);

  console.log(result);
  console.log(result1);

  expect(result.error).toBeUndefined();
  expect(result1.error).toBeDefined();
});

test('Custom validation message', () => {
  const loginSchema = Joi.string().required().min(5).message({
    'string.min': '{{#label}} at least have {{#limit}} length',
  });

  const result = loginSchema.validate('Halo');

  console.log(result.error.message);

  expect(result.error.message).toBe('"value" at least have 5 length');
});

test('Custom validation', () => {
  const registerSchema = Joi.object({
    username: Joi.string().email().min(5).required(),
    password: Joi.string()
      .min(6)
      .required()
      .custom((value, helpers) => {
        if (value.startsWith('john')) {
          return helpers.error('password.wrong');
        }
        return value;
      })
      .message({
        'password.wrong': 'password cannot start with john',
      }),
    confirmPassword: Joi.string().min(6).required(),
  })
    .custom((value, helpers) => {
      if (value.password != value.confirmPassword) {
        return helpers.error('register.password.error');
      }
      return value;
    })
    .message({
      'register.password.error': 'Password is different',
    });

  const result = registerSchema.validate({
    username: 'john@gmail.com',
    password: 'hallodek123',
    confirmPassword: 'hallodek123',
  });

  const result1 = registerSchema.validate({
    username: 'john@gmail.com',
    password: 'john123',
    confirmPassword: 'john123',
  });

  const result2 = registerSchema.validate({
    username: 'john@gmail.com',
    password: 'john123',
    confirmPassword: 'john123',
  });

  console.log(result);

  expect(result.error).toBeUndefined();
  expect(result1.error).toBeDefined();
  expect(result2.error).toBeDefined();
});
