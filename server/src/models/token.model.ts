import mongoose from 'mongoose';

import Token from '../db-interface/token.interface';

const { Schema, model } = mongoose;

const tokenSchema = new Schema<Token>({
  _id: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
  },
});

export default model<Token>('Token', tokenSchema);
