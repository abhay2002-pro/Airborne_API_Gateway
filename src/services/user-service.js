const { UserRepository } = require("../repositories");
const AppError = require("../utils/errors/app-error");
const { StatusCodes } = require("http-status-codes");
const { Auth } = require("../utils/common");
const { checkPassword, createToken, verifyToken } = Auth;

const userRepository = new UserRepository();

async function create(data) {
    try {
        const user = await userRepository.create(data);
        return user;
    } catch(error) {
        console.log(error.name);
        if(error.name == "SequelizeValidationError" || error.name == "SequelizeUniqueConstraintError") {
            let explanation = [];
            error.errors.forEach((err) => { 
                explanation.push(err.message);
            })
            throw new AppError(explanation, StatusCodes.BAD_REQUEST)
        }
        throw new AppError('Cannot create a new User object', StatusCodes.INTERNAL_SERVER_ERROR)
    }
}

async function signin(data) { 
    try {
        const user = await userRepository.getUserByEmail(data.email);
        if(!user){
            throw new AppError('No user found for the given email', StatusCodes.NOT_FOUND)
        }
        const passwordMatch = checkPassword(data.password, user.password);
        if(!passwordMatch){
            throw new AppError('Invalid password', StatusCodes.BAD_REQUEST);
        }
        const jwt = createToken({id: user.id, email: user.email})
        return jwt;
    } catch(error) {
        if(error instanceof AppError) {
            throw error;
        }
        console.log(error);
        throw new AppError('Cannot sign in the user', StatusCodes.INTERNAL_SERVER_ERROR)
    }
}

async function isAuthenticated(token) {
    try {
        if(!token) {
            throw new AppError('Missing JWT token', StatusCodes.BAD_REQUEST);
        }
        const response = Auth.verifyToken(token);
        const user = await userRepo.get(response.id);
        if(!user) {
            throw new AppError('No user found', StatusCodes.NOT_FOUND);
        }
        return user.id;
    } catch(error) {
        if(error instanceof AppError) throw error;
        if(error.name == 'JsonWebTokenError') {
            throw new AppError('Invalid JWT token', StatusCodes.BAD_REQUEST);
        }
        console.log(error);
        throw new AppError('Something went wrong', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}  

module.exports = {
    create,
    signin,
    isAuthenticated
}