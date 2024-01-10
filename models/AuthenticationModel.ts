import Joi from 'joi'

type AuthenticationModel = {
    api_token: string
}

const AuthenticationSchema = Joi.object({
    api_token: Joi.string().required()
})

export {
    AuthenticationModel,
    AuthenticationSchema
}