"use strict";

// IMPORTS ==================================================================================================
const { userService } = require("../services");
const {
	ER_FIELD_EMPTY,
	ER_MISSING_FIELDS,
} = require("../constants/errors.constants");
const Connection = require("../includes/database_connection");

// CONTROLLERS ==============================================================================================
/**
 * List all users - controller
 * @param {object} req
 * @param {object} res
 * @param {object} next
 */
const getAllUsers = async (req, res, next) => {
	const con = req._con;

	try {
		const response = await userService.getAllUsers(con);
		con.release();
		res.send(response);
	} catch (error) {
		con.release();
		next(error);
	}
};

/**
 * Add new user - controller
 * @param {object} req
 * @param {object} res
 * @param {object} next
 */
const addUser = async (req, res, next) => {
	const con = new Connection();
	await con.connect();
	await con.begin();

	try {
		// Validations
		if (!req.body.email) throw ER_FIELD_EMPTY("email");
		if (!req.body.password) throw ER_FIELD_EMPTY("password");
		if (!req.body.firstName) throw ER_FIELD_EMPTY("firstName");

		const response = await userService.addUser(con, req.body);

		await con.commit();
		con.release();

		res.send(response);
	} catch (error) {
		await con.rollback();
		con.release();

		next(error);
	}
};

/**
 * Login user - controller
 * @param {object} req
 * @param {object} res
 * @param {object} next
 */
const userLogin = async (req, res, next) => {
	const con = new Connection();
	await con.connect();
	await con.begin();

	try {
		// Validations
		if (!req.body.email) throw ER_FIELD_EMPTY("email");
		if (!req.body.password) throw ER_FIELD_EMPTY("password");

		const response = await userService.userLogin(con, req.body);

		await con.commit();
		con.release();

		res.send(response);
	} catch (error) {
		await con.rollback();
		con.release();

		next(error);
	}
};

/**
 * Logout user - controller
 * @param {object} req
 * @param {object} res
 * @param {object} next
 */
const userLogout = async (req, res, next) => {
	const con = req._con;
	await con.begin();

	try {
		const response = await userService.userLogout(con, req._id);

		await con.commit();
		con.release();

		res.send(response);
	} catch (error) {
		await con.rollback();
		con.release();

		next(error);
	}
};

/**
 * Delete user - controller
 * @param {object} req
 * @param {object} res
 * @param {object} next
 */
const deleteUser = async (req, res, next) => {
	const con = req._con;
	await con.begin();

	try {
		const response = await userService.deleteUser(con, req.params.id);

		await con.commit();
		con.release();

		res.send(response);
	} catch (error) {
		await con.rollback();
		con.release();

		next(error);
	}
};

/**
 * Update user - controller
 * @param {object} req
 * @param {object} res
 * @param {object} next
 */
const updateUser = async (req, res, next) => {
	const con = req._con;
	await con.begin();

	try {
		const { email, firstName, lastName, contact, blocked } = req.body;
		// Check if email is passed
		if (!email) throw ER_FIELD_EMPTY("email");
		// Check if at least one of the following set items is passed.
		if (!firstName && !lastName && !contact && !blocked)
			throw ER_MISSING_FIELDS("firstName, lastName, contact, blocked");

		let response = await userService.updateUser(con, req.body);

		await con.commit();
		con.release();

		res.send(response);
	} catch (error) {
		await con.rollback();
		con.release();

		next(error);
	}
};

/**
 * User Update Password - controller
 * @param {object} req
 * @param {object} res
 * @param {object} next
 */
const userUpdatePassword = async (req, res, next) => {
	const con = new Connection();
	await con.connect();
	await con.begin();

	try {
		const response = await userService.userUpdatePassword(con, req.body);

		await con.commit();
		con.release();

		res.send(response);
	} catch (error) {
		await con.rollback();
		con.release();

		next(error);
	}
};

// EXPORTS ==================================================================================================
module.exports = {
	getAllUsers,
	addUser,
	userLogin,
	userLogout,
	userUpdatePassword,
	deleteUser,
	updateUser,
};
