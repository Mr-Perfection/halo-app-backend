import { isValidPassword } from './auth';

describe('Test isValidPassword util function.', () => {
    it('Should return false if an invalid password is passed in.', async () => {
        const password = 'a1234k'
        expect(isValidPassword(password)).toBeFalsy()
    })
    it('Should return true if a valid password is passed in.', async () => {
        const password = 'aA1@abc2'
        expect(isValidPassword(password)).toBeTruthy()
    })
}) 