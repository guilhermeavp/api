import mongoose from 'mongoose';

// Define a schema
const Schema = mongoose.Schema;

const userModel = new Schema({
	username: String,
	roles: Array<string>,
	_id: String,
	exp: {type:String, require: true},
	__v: Number,
	iat: String
});

export const SomeModel = mongoose.model('auth', userModel);