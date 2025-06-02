import { Document, Schema, model } from 'mongoose';
import bcrypt from 'bcryptjs';

interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  comparePassword(password: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

userSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.set('toJSON', {
  transform: function (doc, ret) {
    delete ret.password;
    return ret;
  }
});

export default model<IUser>('User', userSchema);
