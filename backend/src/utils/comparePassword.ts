import bcrypt from "bcryptjs";

export const comparePassword = async (
  entered: string,
  hashed: string
): Promise<boolean> => {
  return await bcrypt.compare(entered, hashed);
};
