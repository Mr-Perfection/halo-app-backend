import { checkPassword } from './auth';

describe('Test checkPassword util function.', () => {
    it('Should return false if an invalid password is passed in.', async () => {
        const password = 'a1234k'
        expect(checkPassword(password)).toBeFalsy()
    })
    it('Should return true if a valid password is passed in.', async () => {
        const password = 'aA1@abc2'
        expect(checkPassword(password)).toBeTruthy()
    })
}) 