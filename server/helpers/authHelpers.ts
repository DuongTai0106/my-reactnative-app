import bcrypt from "bcrypt";

export const hashPassword = (password: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(10, (err, salt) => {
      if (err) return reject(err);
      bcrypt.hash(password, salt, (err, hash) => {
        if (err) return reject(err);
        resolve(hash);
      });
    });
  });
};

//compare || decrypt function
export const comparePassword = (password: string, hashed: string) => {
  return bcrypt.compare(password, hashed);
};

