import { expect, describe, it } from 'vitest'
import { RegisterUseCase } from './register'
import { compare } from 'bcryptjs'
import { InMemoryUserRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'

describe('Register Use Case', () => {
    it('should be able to register', async () => {
        const usersRepository = new InMemoryUserRepository()
        const registerUseCase = new RegisterUseCase(usersRepository)

        const { user } = await registerUseCase.execute({
            name: 'Herbert carlos',
            email: 'johndoe@example.com',
            password: '123456'
        })

        expect(user.id).toEqual(expect.any(String))
    })
})

it('should hash user password apon registration', async () => {
    const usersRepository = new InMemoryUserRepository()
    const registerUseCase = new RegisterUseCase(usersRepository)

    const { user } = await registerUseCase.execute({
        name: 'Herbert carlos',
        email: 'johndoe@example.com',
        password: '123456'
    })

    const isPasswordCorrectlyHashed = await compare(
        '123456',
        user.password_hash
    )

    expect(isPasswordCorrectlyHashed).toBe(true)
})

it('should not be able to register with same email twice', async () => {
    const usersRepository = new InMemoryUserRepository()
    const registerUseCase = new RegisterUseCase(usersRepository)

    const email = 'herbert@teste.com'

    await registerUseCase.execute({
        name: 'Herbert carlos',
        email,
        password: '123456'
    })

    await expect(() =>
        registerUseCase.execute({
            name: 'Herbert carlos',
            email,
            password: '123456'
        })
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
})